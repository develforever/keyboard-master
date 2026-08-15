import {
  EMPTY_PROGRESS,
  PROGRESS_SCHEMA_VERSION,
  ProgressPersistenceError,
  type ProgressRepository,
  type ProgressSnapshot,
} from '@/application/ports/progressRepository';

const STORAGE_KEY = 'keyboard-master:progress';
const MAX_RECENT_RESULTS = 50;

/** Walidacja kształtu danych z localStorage — dane z przeglądarki są niezaufane. */
function isProgressSnapshot(value: unknown): value is ProgressSnapshot {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    candidate.schemaVersion === PROGRESS_SCHEMA_VERSION &&
    typeof candidate.xp === 'number' &&
    typeof candidate.bestNetWpm === 'number' &&
    typeof candidate.bestScore === 'number' &&
    typeof candidate.totalSessions === 'number' &&
    Array.isArray(candidate.completedChallengeIds) &&
    Array.isArray(candidate.recentResults)
  );
}

/**
 * Adapter `localStorage`. Bezpieczny przy SSR (brak `window`) i przy
 * wyłączonym / pełnym storage — wtedy odczyt zwraca pusty postęp.
 */
export class LocalProgressRepository implements ProgressRepository {
  private readonly storage: Storage | null;

  constructor(storage?: Storage) {
    if (storage) {
      this.storage = storage;
      return;
    }

    this.storage = typeof window === 'undefined' ? null : window.localStorage;
  }

  async load(): Promise<ProgressSnapshot> {
    if (!this.storage) {
      return EMPTY_PROGRESS;
    }

    try {
      const raw = this.storage.getItem(STORAGE_KEY);

      if (raw === null) {
        return EMPTY_PROGRESS;
      }

      const parsed: unknown = JSON.parse(raw);

      return isProgressSnapshot(parsed) ? parsed : EMPTY_PROGRESS;
    } catch {
      // Uszkodzony JSON lub zablokowany storage — startujemy od zera zamiast psuć aplikację.
      return EMPTY_PROGRESS;
    }
  }

  async save(snapshot: ProgressSnapshot): Promise<void> {
    if (!this.storage) {
      return;
    }

    const trimmed: ProgressSnapshot = {
      ...snapshot,
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      recentResults: snapshot.recentResults.slice(0, MAX_RECENT_RESULTS),
    };

    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      throw new ProgressPersistenceError('Nie udało się zapisać postępu w localStorage.', {
        cause: error,
      });
    }
  }

  async clear(): Promise<void> {
    if (!this.storage) {
      return;
    }

    try {
      this.storage.removeItem(STORAGE_KEY);
    } catch (error) {
      throw new ProgressPersistenceError('Nie udało się wyczyścić postępu.', { cause: error });
    }
  }
}
