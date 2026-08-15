import { describe, expect, it } from 'vitest';

import {
  comboMultiplier,
  computeCombo,
  computeConsistency,
  computeMetrics,
  computeScore,
} from './scoring';
import type { Keystroke } from './types';

/** Buduje ciąg naciśnięć o stałym odstępie; `errorsAt` to indeksy błędnych znaków. */
function strokes(text: string, intervalMs = 100, errorsAt: readonly number[] = []): Keystroke[] {
  const errors = new Set(errorsAt);

  return [...text].map((char, index) => ({
    code: `Key${char.toUpperCase()}`,
    typed: errors.has(index) ? 'x' : char,
    expected: char,
    atMs: (index + 1) * intervalMs,
  }));
}

describe('computeMetrics', () => {
  it('liczy WPM brutto jako znaki/5 na minutę', () => {
    // 60 znaków w 60 s => 12 WPM brutto.
    const metrics = computeMetrics(strokes('a'.repeat(60)), 60_000);

    expect(metrics.grossWpm).toBe(12);
    expect(metrics.netWpm).toBe(12);
    expect(metrics.accuracy).toBe(1);
    expect(metrics.totalChars).toBe(60);
  });

  it('odejmuje niepoprawione błędy od WPM netto', () => {
    const metrics = computeMetrics(strokes('a'.repeat(60), 100, [0, 1, 2]), 60_000);

    expect(metrics.grossWpm).toBe(12);
    expect(metrics.netWpm).toBe(9);
    expect(metrics.incorrectChars).toBe(3);
    expect(metrics.accuracy).toBeCloseTo(57 / 60, 4);
  });

  it('nie schodzi z WPM netto poniżej zera', () => {
    const metrics = computeMetrics(strokes('abcde', 100, [0, 1, 2, 3, 4]), 60_000);

    expect(metrics.netWpm).toBe(0);
  });

  it('zwraca zera dla zerowego czasu trwania', () => {
    const metrics = computeMetrics(strokes('abc'), 0);

    expect(metrics.grossWpm).toBe(0);
    expect(metrics.cpm).toBe(0);
    expect(metrics.elapsedMs).toBe(0);
  });

  it('pomija klawisze sterujące w statystykach', () => {
    const control: Keystroke = { code: 'ShiftLeft', typed: null, expected: null, atMs: 10 };
    const metrics = computeMetrics([control, ...strokes('abc')], 60_000);

    expect(metrics.totalChars).toBe(3);
  });

  it('traktuje pustą sesję jako 100% celności', () => {
    expect(computeMetrics([], 1000).accuracy).toBe(1);
  });
});

describe('computeConsistency', () => {
  it('zwraca 1 dla idealnie równego rytmu', () => {
    expect(computeConsistency(strokes('abcdefgh', 100))).toBe(1);
  });

  it('zwraca 1 przy zbyt małej liczbie znaków', () => {
    expect(computeConsistency(strokes('ab'))).toBe(1);
  });

  it('spada przy nierównym rytmie', () => {
    const uneven: Keystroke[] = [10, 20, 400, 410, 900].map((atMs, index) => ({
      code: `Key${index}`,
      typed: 'a',
      expected: 'a',
      atMs,
    }));

    expect(computeConsistency(uneven)).toBeLessThan(1);
    expect(computeConsistency(uneven)).toBeGreaterThanOrEqual(0);
  });
});

describe('computeCombo', () => {
  it('zeruje serię na błędzie i pamięta najlepszą', () => {
    const combo = computeCombo(strokes('a'.repeat(30), 100, [10]));

    expect(combo.best).toBe(19);
    expect(combo.current).toBe(19);
  });

  it('nie zrywa serii na klawiszu sterującym', () => {
    const control: Keystroke = { code: 'ShiftLeft', typed: null, expected: null, atMs: 250 };
    const combo = computeCombo([...strokes('ab'), control, ...strokes('cd')]);

    expect(combo.current).toBe(4);
  });

  it('dobiera mnożnik do progu', () => {
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(9)).toBe(1);
    expect(comboMultiplier(10)).toBe(1.25);
    expect(comboMultiplier(99)).toBe(2);
    expect(comboMultiplier(1000)).toBe(3);
  });
});

describe('computeScore', () => {
  it('rośnie z trudnością przy identycznym wyniku', () => {
    const metrics = computeMetrics(strokes('a'.repeat(60)), 60_000);
    const combo = computeCombo(strokes('a'.repeat(60)));

    const easy = computeScore({ metrics, combo, difficulty: 'easy' });
    const insane = computeScore({ metrics, combo, difficulty: 'insane' });

    expect(insane).toBeGreaterThan(easy);
  });

  it('karze kwadratowo za spadek celności', () => {
    const clean = strokes('a'.repeat(60));
    const dirty = strokes('a'.repeat(60), 100, [0, 5, 9, 20, 33, 41]);

    const cleanScore = computeScore({
      metrics: computeMetrics(clean, 60_000),
      combo: computeCombo(clean),
      difficulty: 'normal',
    });
    const dirtyScore = computeScore({
      metrics: computeMetrics(dirty, 60_000),
      combo: computeCombo(dirty),
      difficulty: 'normal',
    });

    expect(dirtyScore).toBeLessThan(cleanScore);
  });

  it('zwraca 0 dla sesji bez poprawnych znaków', () => {
    const failed = strokes('abcde', 100, [0, 1, 2, 3, 4]);

    expect(
      computeScore({
        metrics: computeMetrics(failed, 60_000),
        combo: computeCombo(failed),
        difficulty: 'hard',
      }),
    ).toBe(0);
  });
});
