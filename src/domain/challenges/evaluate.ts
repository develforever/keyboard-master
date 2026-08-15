import type { SessionResult } from '../engine/types';
import type { Challenge, ChallengeGoal, ChallengeOutcome, GoalOutcome } from './types';

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Ocena pojedynczego celu względem wyniku sesji. */
export function evaluateGoal(goal: ChallengeGoal, result: SessionResult): GoalOutcome {
  const { metrics, combo } = result;

  switch (goal.kind) {
    case 'netWpm':
      return {
        goal,
        actual: metrics.netWpm,
        passed: metrics.netWpm >= goal.target,
        progress: goal.target <= 0 ? 1 : clamp01(metrics.netWpm / goal.target),
      };

    case 'accuracy':
      return {
        goal,
        actual: metrics.accuracy,
        passed: metrics.accuracy >= goal.target,
        progress: goal.target <= 0 ? 1 : clamp01(metrics.accuracy / goal.target),
      };

    case 'combo':
      return {
        goal,
        actual: combo.best,
        passed: combo.best >= goal.target,
        progress: goal.target <= 0 ? 1 : clamp01(combo.best / goal.target),
      };

    case 'consistency':
      return {
        goal,
        actual: metrics.consistency,
        passed: metrics.consistency >= goal.target,
        progress: goal.target <= 0 ? 1 : clamp01(metrics.consistency / goal.target),
      };

    case 'noMistakes':
      return {
        goal,
        actual: metrics.incorrectChars,
        passed: metrics.incorrectChars === 0 && metrics.totalChars > 0,
        progress: metrics.incorrectChars === 0 && metrics.totalChars > 0 ? 1 : 0,
      };

    case 'underTime':
      return {
        goal,
        actual: metrics.elapsedMs,
        passed: metrics.elapsedMs > 0 && metrics.elapsedMs <= goal.limitMs,
        progress:
          metrics.elapsedMs <= 0 ? 0 : clamp01(goal.limitMs / Math.max(metrics.elapsedMs, 1)),
      };

    default: {
      // Wymusza obsłużenie każdego wariantu ChallengeGoal na etapie kompilacji.
      const exhaustive: never = goal;
      throw new Error(`Nieobsłużony typ celu: ${JSON.stringify(exhaustive)}`);
    }
  }
}

/**
 * Ocenia challenge. XP przyznawane jest wyłącznie przy komplecie spełnionych celów;
 * `alreadyCompleted` zeruje nagrodę przy powtórnym przejściu.
 */
export function evaluateChallenge(
  challenge: Challenge,
  result: SessionResult,
  alreadyCompleted = false,
): ChallengeOutcome {
  const goals = challenge.goals.map((goal) => evaluateGoal(goal, result));
  const passed = goals.length > 0 && goals.every((outcome) => outcome.passed);

  return {
    challengeId: challenge.id,
    passed,
    goals,
    awardedXp: passed && !alreadyCompleted ? challenge.rewardXp : 0,
    result,
  };
}

/** Challenge'e odblokowane przy danym zestawie ukończonych id. */
export function unlockedChallenges(
  challenges: readonly Challenge[],
  completedIds: readonly string[],
): readonly Challenge[] {
  const completed = new Set(completedIds);

  return challenges.filter((challenge) =>
    challenge.requires.every((requiredId) => completed.has(requiredId)),
  );
}
