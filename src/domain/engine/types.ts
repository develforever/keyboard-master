import type { KeyCode } from '../keyboard/types';

/** Pojedyncze naciśnięcie zarejestrowane w trakcie sesji. */
export interface Keystroke {
  readonly code: KeyCode;
  /** Znak faktycznie wpisany (`KeyboardEvent.key`) — null dla klawiszy sterujących. */
  readonly typed: string | null;
  /** Znak oczekiwany na tej pozycji tekstu. */
  readonly expected: string | null;
  /** Milisekundy od startu sesji (monotoniczne, z `performance.now()`). */
  readonly atMs: number;
}

/** Wyliczone statystyki sesji. Wszystkie pola są pochodne — nic nie jest trzymane w stanie. */
export interface SessionMetrics {
  /** Brutto: (wszystkie znaki / 5) / minuty. */
  readonly grossWpm: number;
  /** Netto: brutto pomniejszone o niepoprawione błędy na minutę, nigdy < 0. */
  readonly netWpm: number;
  /** Znaki na minutę (poprawne). */
  readonly cpm: number;
  /** 0–1. */
  readonly accuracy: number;
  /** 0–1; 1 = idealnie równy rytm. Odwrotność współczynnika zmienności odstępów. */
  readonly consistency: number;
  readonly correctChars: number;
  readonly incorrectChars: number;
  readonly totalChars: number;
  readonly elapsedMs: number;
}

/** Stan licznika combo — warstwa gamingowa. */
export interface ComboState {
  readonly current: number;
  readonly best: number;
  /** Mnożnik punktów wynikający z aktualnego combo. */
  readonly multiplier: number;
}

/** Wynik zakończonej sesji — jednostka zapisywana w repozytorium postępu. */
export interface SessionResult {
  readonly id: string;
  readonly challengeId: string | null;
  readonly finishedAt: number;
  readonly metrics: SessionMetrics;
  readonly combo: ComboState;
  readonly score: number;
}
