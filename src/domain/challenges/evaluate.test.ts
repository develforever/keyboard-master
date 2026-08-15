import { describe, expect, it } from 'vitest';

import type { SessionResult, SessionMetrics } from '../engine/types';
import { CHALLENGES, findChallenge } from './definitions';
import { evaluateChallenge, evaluateGoal, unlockedChallenges } from './evaluate';
import type { Challenge } from './types';

function metrics(overrides: Partial<SessionMetrics> = {}): SessionMetrics {
  return {
    grossWpm: 50,
    netWpm: 45,
    cpm: 220,
    accuracy: 0.98,
    consistency: 0.85,
    correctChars: 220,
    incorrectChars: 4,
    totalChars: 224,
    elapsedMs: 60_000,
    ...overrides,
  };
}

function result(overrides: Partial<SessionResult> = {}): SessionResult {
  return {
    id: 'session-1',
    challengeId: null,
    finishedAt: 1_700_000_000_000,
    metrics: metrics(),
    combo: { current: 120, best: 120, multiplier: 3 },
    score: 4200,
    ...overrides,
  };
}

describe('evaluateGoal', () => {
  it('zalicza cel WPM po osiągnięciu progu', () => {
    expect(evaluateGoal({ kind: 'netWpm', target: 45 }, result()).passed).toBe(true);
    expect(evaluateGoal({ kind: 'netWpm', target: 46 }, result()).passed).toBe(false);
  });

  it('raportuje postęp ograniczony do przedziału 0–1', () => {
    const outcome = evaluateGoal({ kind: 'netWpm', target: 10 }, result());

    expect(outcome.progress).toBe(1);
    expect(evaluateGoal({ kind: 'netWpm', target: 90 }, result()).progress).toBeCloseTo(0.5, 5);
  });

  it('nie zalicza "bez błędu" przy pustej sesji', () => {
    const empty = result({ metrics: metrics({ incorrectChars: 0, totalChars: 0 }) });

    expect(evaluateGoal({ kind: 'noMistakes' }, empty).passed).toBe(false);
  });

  it('zalicza "bez błędu" tylko przy zerowej liczbie pomyłek', () => {
    const flawless = result({ metrics: metrics({ incorrectChars: 0, accuracy: 1 }) });

    expect(evaluateGoal({ kind: 'noMistakes' }, flawless).passed).toBe(true);
    expect(evaluateGoal({ kind: 'noMistakes' }, result()).passed).toBe(false);
  });

  it('mierzy limit czasu włącznie z wartością brzegową', () => {
    expect(evaluateGoal({ kind: 'underTime', limitMs: 60_000 }, result()).passed).toBe(true);
    expect(evaluateGoal({ kind: 'underTime', limitMs: 59_999 }, result()).passed).toBe(false);
  });
});

describe('evaluateChallenge', () => {
  const challenge: Challenge = {
    id: 'test',
    name: 'Test',
    description: '',
    difficulty: 'normal',
    goals: [
      { kind: 'netWpm', target: 40 },
      { kind: 'accuracy', target: 0.95 },
    ],
    source: { kind: 'static', text: 'abc' },
    rewardXp: 100,
    requires: [],
  };

  it('przyznaje XP tylko przy komplecie spełnionych celów', () => {
    expect(evaluateChallenge(challenge, result()).awardedXp).toBe(100);

    const slow = result({ metrics: metrics({ netWpm: 10 }) });
    expect(evaluateChallenge(challenge, slow).awardedXp).toBe(0);
    expect(evaluateChallenge(challenge, slow).passed).toBe(false);
  });

  it('nie przyznaje XP za powtórne przejście', () => {
    expect(evaluateChallenge(challenge, result(), true).awardedXp).toBe(0);
    expect(evaluateChallenge(challenge, result(), true).passed).toBe(true);
  });

  it('nie zalicza challenge’a bez celów', () => {
    expect(evaluateChallenge({ ...challenge, goals: [] }, result()).passed).toBe(false);
  });
});

describe('CHALLENGES', () => {
  it('ma unikalne identyfikatory', () => {
    const ids = CHALLENGES.map((challenge) => challenge.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nie odwołuje się do nieistniejących wymagań', () => {
    for (const challenge of CHALLENGES) {
      for (const requiredId of challenge.requires) {
        expect(findChallenge(requiredId), `${challenge.id} -> ${requiredId}`).toBeDefined();
      }
    }
  });

  it('odblokowuje tylko pierwszy challenge na starcie', () => {
    expect(unlockedChallenges(CHALLENGES, []).map((challenge) => challenge.id)).toEqual([
      'home-row-warmup',
    ]);
  });

  it('odblokowuje kolejny po spełnieniu wymagania', () => {
    const unlocked = unlockedChallenges(CHALLENGES, ['home-row-warmup']).map((c) => c.id);

    expect(unlocked).toContain('first-blood');
    expect(unlocked).not.toContain('flawless-run');
  });
});
