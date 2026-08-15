import type { SessionResult } from '@/domain/engine/types';

/**
 * Port persystencji postępu gracza.
 *
 * Warstwa aplikacji zna wyłącznie ten interfejs. Adapter lokalny
 * (`localStorage`) można podmienić na klienta HTTP bez zmiany domeny —
 * patrz ADR 0001.
 */

/** Wersja schematu — pozwala odrzucić/zmigrować stare dane z przeglądarki. */
export const PROGRESS_SCHEMA_VERSION = 1;

export interface ProgressSnapshot {
  readonly schemaVersion: number;
  readonly xp: number;
  readonly completedChallengeIds: readonly string[];
  readonly bestNetWpm: number;
  readonly bestScore: number;
  readonly totalSessions: number;
  /** Ostatnie sesje, od najnowszej. Adapter przycina listę do rozsądnego limitu. */
  readonly recentResults: readonly SessionResult[];
}

export const EMPTY_PROGRESS: ProgressSnapshot = {
  schemaVersion: PROGRESS_SCHEMA_VERSION,
  xp: 0,
  completedChallengeIds: [],
  bestNetWpm: 0,
  bestScore: 0,
  totalSessions: 0,
  recentResults: [],
};

export interface ProgressRepository {
  /** Zwraca zapisany postęp albo `EMPTY_PROGRESS`, gdy brak danych. Nigdy nie rzuca. */
  load(): Promise<ProgressSnapshot>;
  /** Zapisuje postęp. Rzuca `ProgressPersistenceError`, gdy zapis się nie powiedzie. */
  save(snapshot: ProgressSnapshot): Promise<void>;
  /** Czyści postęp gracza. */
  clear(): Promise<void>;
}

export class ProgressPersistenceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ProgressPersistenceError';
  }
}
