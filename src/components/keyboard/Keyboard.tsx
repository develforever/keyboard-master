'use client';

import type { KeyEventPayload } from '@/application/input/keyStream';
import { ANSI_104 } from '@/domain/keyboard';
import { SECTION_WIDTH, type KeyCode, type KeyboardLayout } from '@/domain/keyboard/types';

import Key from './Key';
import { useKeyboardInput } from './useKeyboardInput';
import './Keyboard.css';

interface KeyboardProps {
  readonly layout?: KeyboardLayout;
  /** Klawisz podpowiadany graczowi (następny znak do wpisania). */
  readonly hintedCode?: KeyCode | null;
  /** Callback do warstwy silnika gry. */
  readonly onKeyEvent?: (event: KeyEventPayload) => void;
}

/**
 * Renderer klawiatury sterowany danymi. Cała topologia pochodzi z `KeyboardLayout`
 * — dodanie układu ISO/PL to nowy plik w `domain/keyboard/layouts`, bez zmian tutaj.
 */
export default function Keyboard({
  layout = ANSI_104,
  hintedCode = null,
  onKeyEvent,
}: KeyboardProps) {
  useKeyboardInput(onKeyEvent);

  return (
    <div className="keyboard" role="group" aria-label={`Klawiatura ${layout.name}`}>
      {layout.rows.map((row, rowIndex) => (
        <div className="keyboard__row" key={`${layout.id}-row-${rowIndex}`}>
          {(['main', 'nav', 'numpad'] as const).map((section) => (
            <div
              className={`keyboard__section keyboard__section--${section}`}
              style={{ flexGrow: SECTION_WIDTH[section], flexBasis: 0 }}
              key={section}
            >
              {row[section].map((definition, keyIndex) => (
                <Key
                  key={definition.code ?? `${section}-spacer-${rowIndex}-${keyIndex}`}
                  definition={definition}
                  hinted={definition.code !== null && definition.code === hintedCode}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
