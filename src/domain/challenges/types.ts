import type { Difficulty } from '../engine/scoring';
import type { SessionResult } from '../engine/types';

/**
 * Warunek zaliczenia challenge'a. Suma typów jest domknięta — dodanie nowego
 * wariantu wymusza uzupełnienie `switch` w `evaluate.ts` (exhaustiveness check).
 */
export type ChallengeGoal =
  | { readonly kind: 'netWpm'; readonly target: number }
  | { readonly kind: 'accuracy'; readonly target: number }
  | { readonly kind: 'combo'; readonly target: number }
  | { readonly kind: 'consistency'; readonly target: number }
  | { readonly kind: 'noMistakes' }
  | { readonly kind: 'underTime'; readonly limitMs: number };

/** Źródło tekstu do przepisania. */
export type TextSource =
  | { readonly kind: 'static'; readonly text: string }
  | { readonly kind: 'remote'; readonly paragraphs: number }
  | { readonly kind: 'drill'; readonly codes: readonly string[]; readonly length: number };

export interface Challenge {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly difficulty: Difficulty;
  /** Wszystkie cele muszą być spełnione, żeby challenge był zaliczony. */
  readonly goals: readonly ChallengeGoal[];
  readonly source: TextSource;
  readonly rewardXp: number;
  /** Id challenge'y, które trzeba ukończyć wcześniej. */
  readonly requires: readonly string[];
}

/** Stan pojedynczego celu po zakończeniu sesji. */
export interface GoalOutcome {
  readonly goal: ChallengeGoal;
  readonly passed: boolean;
  /** Osiągnięta wartość w jednostce celu. */
  readonly actual: number;
  /** Postęp 0–1 względem progu. */
  readonly progress: number;
}

export interface ChallengeOutcome {
  readonly challengeId: string;
  readonly passed: boolean;
  readonly goals: readonly GoalOutcome[];
  readonly awardedXp: number;
  readonly result: SessionResult;
}
