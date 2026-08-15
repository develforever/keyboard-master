import { fromEvent, merge, type Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import type { KeyCode } from '@/domain/keyboard/types';

export type KeyPhase = 'down' | 'up';

export interface KeyEventPayload {
  readonly code: KeyCode;
  /** `KeyboardEvent.key` — zależny od układu językowego, używany do porównania znaku. */
  readonly key: string;
  readonly phase: KeyPhase;
  /** Auto-powtarzanie przy przytrzymaniu klawisza. */
  readonly repeat: boolean;
  readonly shiftKey: boolean;
  readonly ctrlKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  /** Monotoniczny znacznik czasu w ms (`performance.now()`). */
  readonly atMs: number;
}

/**
 * Klawisze, których domyślna akcja przeglądarki przeszkadza w grze
 * (przewijanie, cofanie strony, quick-find). Celowo NIE zawiera F1–F12,
 * Escape ani żadnej kombinacji z Ctrl/Meta/Alt — blokowanie F5, F12 czy
 * Ctrl+W byłoby wrogie dla użytkownika.
 */
const SWALLOWED_CODES: ReadonlySet<KeyCode> = new Set([
  'Tab',
  'Space',
  'Backspace',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  'Slash',
  'Quote',
]);

const EDITABLE_TAGS: ReadonlySet<string> = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/** Czy zdarzenie pochodzi z pola formularza — wtedy gra nie przejmuje klawiatury. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return EDITABLE_TAGS.has(target.tagName) || target.isContentEditable;
}

function shouldPreventDefault(event: KeyboardEvent): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  return SWALLOWED_CODES.has(event.code);
}

function toPayload(event: KeyboardEvent, phase: KeyPhase): KeyEventPayload {
  return {
    code: event.code,
    key: event.key,
    phase,
    repeat: event.repeat,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    metaKey: event.metaKey,
    atMs: performance.now(),
  };
}

/**
 * Strumień zdarzeń klawiatury z całego okna.
 *
 * Nie używa `stopPropagation()` — zatrzymywanie propagacji na `window` psuje
 * skróty innych komponentów i rozszerzeń przeglądarki.
 */
export function createKeyStream(target: Window = window): Observable<KeyEventPayload> {
  const down$ = fromEvent<KeyboardEvent>(target, 'keydown').pipe(
    filter((event) => !isEditableTarget(event.target)),
    map((event) => {
      if (shouldPreventDefault(event)) {
        event.preventDefault();
      }

      return toPayload(event, 'down');
    }),
  );

  const up$ = fromEvent<KeyboardEvent>(target, 'keyup').pipe(
    filter((event) => !isEditableTarget(event.target)),
    map((event) => toPayload(event, 'up')),
  );

  return merge(down$, up$);
}

/**
 * Strumień utraty fokusu okna. Bez tego klawisze przytrzymane w momencie
 * przełączenia okna (np. Alt+Tab) zostają "wciśnięte" na zawsze.
 */
export function createBlurStream(target: Window = window): Observable<void> {
  return merge(
    fromEvent(target, 'blur'),
    fromEvent(target.document, 'visibilitychange').pipe(
      filter(() => target.document.visibilityState === 'hidden'),
    ),
  ).pipe(map(() => undefined));
}
