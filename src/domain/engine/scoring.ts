import type { ComboState, Keystroke, SessionMetrics } from './types';

/** Umowna długość "słowa" w pomiarze WPM. */
const CHARS_PER_WORD = 5;
const MS_PER_MINUTE = 60_000;

/** Progi combo → mnożnik punktów. Muszą być posortowane rosnąco po `streak`. */
export const COMBO_TIERS: readonly { readonly streak: number; readonly multiplier: number }[] = [
  { streak: 0, multiplier: 1 },
  { streak: 10, multiplier: 1.25 },
  { streak: 25, multiplier: 1.5 },
  { streak: 50, multiplier: 2 },
  { streak: 100, multiplier: 3 },
];

/** Mnożnik punktowy poziomów trudności challenge'y. */
export const DIFFICULTY_MULTIPLIER = {
  easy: 1,
  normal: 1.25,
  hard: 1.6,
  insane: 2.2,
} as const;

export type Difficulty = keyof typeof DIFFICULTY_MULTIPLIER;

/** Czy naciśnięcie jest liczone jako znak tekstu (pomija modyfikatory i klawisze sterujące). */
export function isTextKeystroke(keystroke: Keystroke): boolean {
  return keystroke.typed !== null && keystroke.expected !== null;
}

/** Czy naciśnięcie było poprawne. Rozróżnia wielkość liter. */
export function isCorrect(keystroke: Keystroke): boolean {
  return isTextKeystroke(keystroke) && keystroke.typed === keystroke.expected;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/**
 * Równość rytmu jako 1 - współczynnik zmienności odstępów między znakami.
 * Zwraca 1 dla mniej niż 3 znaków (za mało danych, nie karzemy gracza).
 */
export function computeConsistency(keystrokes: readonly Keystroke[]): number {
  const text = keystrokes.filter(isTextKeystroke);

  if (text.length < 3) {
    return 1;
  }

  const intervals: number[] = [];
  for (let i = 1; i < text.length; i += 1) {
    intervals.push(text[i].atMs - text[i - 1].atMs);
  }

  const mean = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;

  if (mean <= 0) {
    return 1;
  }

  const variance =
    intervals.reduce((sum, value) => sum + (value - mean) ** 2, 0) / intervals.length;
  const coefficientOfVariation = Math.sqrt(variance) / mean;

  return clamp(1 - coefficientOfVariation, 0, 1);
}

/**
 * Wylicza komplet statystyk sesji.
 *
 * @param keystrokes Chronologiczna lista naciśnięć.
 * @param elapsedMs  Czas trwania sesji w ms. Wartości <= 0 dają metryki zerowe.
 */
export function computeMetrics(
  keystrokes: readonly Keystroke[],
  elapsedMs: number,
): SessionMetrics {
  const text = keystrokes.filter(isTextKeystroke);
  const totalChars = text.length;
  const correctChars = text.filter(isCorrect).length;
  const incorrectChars = totalChars - correctChars;

  const empty: SessionMetrics = {
    grossWpm: 0,
    netWpm: 0,
    cpm: 0,
    accuracy: totalChars === 0 ? 1 : round(correctChars / totalChars, 4),
    consistency: computeConsistency(keystrokes),
    correctChars,
    incorrectChars,
    totalChars,
    elapsedMs: Math.max(0, elapsedMs),
  };

  if (elapsedMs <= 0 || totalChars === 0) {
    return empty;
  }

  const minutes = elapsedMs / MS_PER_MINUTE;
  const grossWpm = totalChars / CHARS_PER_WORD / minutes;
  const netWpm = Math.max(0, grossWpm - incorrectChars / minutes);

  return {
    ...empty,
    grossWpm: round(grossWpm),
    netWpm: round(netWpm),
    cpm: round(correctChars / minutes),
  };
}

/**
 * Przelicza combo: każdy poprawny znak przedłuża serię, błąd ją zeruje.
 * Klawisze sterujące (Shift, Ctrl) są ignorowane — nie zrywają serii.
 */
export function computeCombo(keystrokes: readonly Keystroke[]): ComboState {
  let current = 0;
  let best = 0;

  for (const keystroke of keystrokes) {
    if (!isTextKeystroke(keystroke)) {
      continue;
    }

    current = isCorrect(keystroke) ? current + 1 : 0;
    best = Math.max(best, current);
  }

  return { current, best, multiplier: comboMultiplier(current) };
}

/** Mnożnik dla podanej długości serii. */
export function comboMultiplier(streak: number): number {
  let multiplier = COMBO_TIERS[0].multiplier;

  for (const tier of COMBO_TIERS) {
    if (streak >= tier.streak) {
      multiplier = tier.multiplier;
    }
  }

  return multiplier;
}

export interface ScoreInput {
  readonly metrics: SessionMetrics;
  readonly combo: ComboState;
  readonly difficulty: Difficulty;
}

/**
 * Punktacja sesji: baza za poprawne znaki, kara kwadratowa za brak precyzji,
 * premia za najdłuższą serię i za trudność challenge'a.
 */
export function computeScore({ metrics, combo, difficulty }: ScoreInput): number {
  const base = metrics.correctChars * 10;
  const accuracyFactor = metrics.accuracy ** 2;
  const speedBonus = 1 + metrics.netWpm / 200;

  return Math.round(
    base *
      accuracyFactor *
      speedBonus *
      comboMultiplier(combo.best) *
      DIFFICULTY_MULTIPLIER[difficulty],
  );
}
