'use client';

import clsx from 'clsx';

import { useIsKeyPressed } from '@/application/stores/useKeyboardStore';
import type { KeyDef } from '@/domain/keyboard/types';

interface KeyProps {
  readonly definition: KeyDef;
  /** Podświetlenie klawisza, który gracz powinien teraz nacisnąć (podpowiedź). */
  readonly hinted?: boolean;
}

/**
 * Pojedynczy klawisz. Subskrybuje wyłącznie własny boolean ze store'a, więc
 * naciśnięcie jednego klawisza renderuje jeden komponent, a nie całą klawiaturę.
 */
export default function Key({ definition, hinted = false }: KeyProps) {
  const isPressed = useIsKeyPressed(definition.code);
  const isDecorative = definition.code === null;

  return (
    <div
      className={clsx('keyboard__key', {
        'keyboard__key--spacer': isDecorative,
        'keyboard__key--active': isPressed,
        'keyboard__key--hinted': hinted && !isPressed,
        'keyboard__key--home': definition.homeRow,
      })}
      style={{ flexGrow: definition.width, flexBasis: 0 }}
      data-code={definition.code ?? undefined}
      data-finger={definition.finger}
      aria-hidden={isDecorative || undefined}
    >
      {definition.shiftLabel !== undefined && (
        <span className="keyboard__key-shift">{definition.shiftLabel}</span>
      )}
      <span className="keyboard__key-label">{definition.label}</span>
    </div>
  );
}
