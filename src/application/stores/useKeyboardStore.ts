import { create } from 'zustand';

import type { KeyCode } from '@/domain/keyboard/types';

/**
 * Stan wciśniętych klawiszy.
 *
 * Trzymany poza Reactem celowo: przy 100+ WPM `setState` z Contextu
 * przerenderowałby całe drzewo klawiatury na każde naciśnięcie. Każdy klawisz
 * subskrybuje wyłącznie własny boolean przez selektor — patrz ADR 0002.
 */
interface KeyboardState {
  readonly pressed: ReadonlySet<KeyCode>;
  /** Ostatnio naciśnięty klawisz — dla efektów UI (combo popup, ripple). */
  readonly lastCode: KeyCode | null;
  press: (code: KeyCode) => void;
  release: (code: KeyCode) => void;
  releaseAll: () => void;
}

export const useKeyboardStore = create<KeyboardState>((set) => ({
  pressed: new Set<KeyCode>(),
  lastCode: null,

  press: (code) =>
    set((state) => {
      if (state.pressed.has(code)) {
        return state;
      }

      const pressed = new Set(state.pressed);
      pressed.add(code);

      return { pressed, lastCode: code };
    }),

  release: (code) =>
    set((state) => {
      if (!state.pressed.has(code)) {
        return state;
      }

      const pressed = new Set(state.pressed);
      pressed.delete(code);

      return { pressed };
    }),

  releaseAll: () =>
    set((state) => (state.pressed.size === 0 ? state : { pressed: new Set<KeyCode>() })),
}));

/**
 * Subskrybuje stan pojedynczego klawisza. Selektor zwraca `boolean`, więc
 * domyślne porównanie `Object.is` w zustandzie odcina zbędne renderowanie.
 */
export function useIsKeyPressed(code: KeyCode | null): boolean {
  return useKeyboardStore((state) => (code === null ? false : state.pressed.has(code)));
}
