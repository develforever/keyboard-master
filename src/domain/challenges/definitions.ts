import type { Challenge } from './types';

/**
 * Startowy zestaw challenge'y. Docelowo przenoszony do bazy — dlatego jest
 * czystymi danymi, bez importów z warstwy UI ani infrastruktury.
 */
export const CHALLENGES: readonly Challenge[] = [
  {
    id: 'home-row-warmup',
    name: 'Rozgrzewka na home row',
    description: 'Przepisz 120 znaków z rzędu spoczynkowego bez schodzenia poniżej 95% celności.',
    difficulty: 'easy',
    goals: [
      { kind: 'accuracy', target: 0.95 },
      { kind: 'combo', target: 20 },
    ],
    source: {
      kind: 'drill',
      codes: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'],
      length: 120,
    },
    rewardXp: 50,
    requires: [],
  },
  {
    id: 'first-blood',
    name: 'Pierwsza krew',
    description: 'Ukończ dowolny akapit z prędkością minimum 30 WPM netto.',
    difficulty: 'easy',
    goals: [{ kind: 'netWpm', target: 30 }],
    source: { kind: 'remote', paragraphs: 1 },
    rewardXp: 75,
    requires: ['home-row-warmup'],
  },
  {
    id: 'flawless-run',
    name: 'Bez skazy',
    description: 'Przepisz cały akapit bez ani jednego błędu.',
    difficulty: 'normal',
    goals: [{ kind: 'noMistakes' }],
    source: { kind: 'remote', paragraphs: 1 },
    rewardXp: 150,
    requires: ['first-blood'],
  },
  {
    id: 'metronome',
    name: 'Metronom',
    description: 'Utrzymaj równy rytm — 80% równości przy min. 40 WPM netto.',
    difficulty: 'hard',
    goals: [
      { kind: 'consistency', target: 0.8 },
      { kind: 'netWpm', target: 40 },
    ],
    source: { kind: 'remote', paragraphs: 2 },
    rewardXp: 250,
    requires: ['flawless-run'],
  },
  {
    id: 'sprint-60',
    name: 'Sprint 60',
    description: 'Dwa akapity w minutę, 60 WPM netto i seria 100 poprawnych znaków.',
    difficulty: 'insane',
    goals: [
      { kind: 'netWpm', target: 60 },
      { kind: 'combo', target: 100 },
      { kind: 'underTime', limitMs: 60_000 },
    ],
    source: { kind: 'remote', paragraphs: 2 },
    rewardXp: 500,
    requires: ['metronome'],
  },
];

/** Wyszukuje challenge po id. Zwraca `undefined`, gdy nie istnieje. */
export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((challenge) => challenge.id === id);
}
