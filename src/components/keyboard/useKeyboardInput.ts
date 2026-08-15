'use client';

import { useEffect } from 'react';

import {
  createBlurStream,
  createKeyStream,
  type KeyEventPayload,
} from '@/application/input/keyStream';
import { useKeyboardStore } from '@/application/stores/useKeyboardStore';

/**
 * Podpina globalny strumień klawiatury do store'a.
 *
 * Powinien być zamontowany dokładnie raz w drzewie — podwójna subskrypcja
 * nie psuje stanu (operacje są idempotentne), ale niepotrzebnie mnoży pracę.
 *
 * @param onKeyEvent Opcjonalny callback dla warstwy silnika gry. Trzymany
 *   w ref-less closure — hook celowo nie ma go w zależnościach, bo strumień
 *   ma żyć przez cały czas życia komponentu.
 */
export function useKeyboardInput(onKeyEvent?: (event: KeyEventPayload) => void): void {
  const press = useKeyboardStore((state) => state.press);
  const release = useKeyboardStore((state) => state.release);
  const releaseAll = useKeyboardStore((state) => state.releaseAll);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const keySubscription = createKeyStream(window).subscribe({
      next: (event) => {
        if (event.phase === 'down') {
          press(event.code);
        } else {
          release(event.code);
        }

        onKeyEvent?.(event);
      },
      error: (error: unknown) => {
        console.error('[keyboard] strumień klawiatury przerwany', error);
      },
    });

    // Alt+Tab / zmiana karty zostawia klawisze "wciśnięte" — czyścimy stan.
    const blurSubscription = createBlurStream(window).subscribe(() => releaseAll());

    return () => {
      keySubscription.unsubscribe();
      blurSubscription.unsubscribe();
      releaseAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [press, release, releaseAll]);
}
