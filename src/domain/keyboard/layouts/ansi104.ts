import type { KeyDef, KeyboardLayout, KeyboardRow } from '../types';

/**
 * Układ ANSI 104 (US). Każdy rząd bloku `main` sumuje się dokładnie do 15u,
 * `nav` do 3u, `numpad` do 4u — pilnuje tego test `layout.test.ts`.
 *
 * Ograniczenie znane: klawisze `NumpadAdd` i `NumpadEnter` są fizycznie
 * wysokie na 2u; renderer oparty na rzędach flex nie odwzorowuje pionowego
 * scalania, więc zajmują jedno pole, a pod nimi jest wypełniacz.
 * Zmiana wymaga renderera opartego na CSS Grid — patrz ADR 0003.
 */

/** Pole dekoracyjne / wypełniacz — nie reaguje na klawiaturę. */
const gap = (width: number, label = ''): KeyDef => ({ code: null, label, width });

const row0: KeyboardRow = {
  main: [
    { code: 'Escape', label: 'esc', width: 1 },
    gap(1),
    { code: 'F1', label: 'F1', width: 1 },
    { code: 'F2', label: 'F2', width: 1 },
    { code: 'F3', label: 'F3', width: 1 },
    { code: 'F4', label: 'F4', width: 1 },
    gap(0.5),
    { code: 'F5', label: 'F5', width: 1 },
    { code: 'F6', label: 'F6', width: 1 },
    { code: 'F7', label: 'F7', width: 1 },
    { code: 'F8', label: 'F8', width: 1 },
    gap(0.5),
    { code: 'F9', label: 'F9', width: 1 },
    { code: 'F10', label: 'F10', width: 1 },
    { code: 'F11', label: 'F11', width: 1 },
    { code: 'F12', label: 'F12', width: 1 },
  ],
  nav: [
    { code: 'PrintScreen', label: 'prt sc', width: 1 },
    { code: 'ScrollLock', label: 'scr lk', width: 1 },
    { code: 'Pause', label: 'pause', width: 1 },
  ],
  numpad: [gap(4)],
};

const row1: KeyboardRow = {
  main: [
    { code: 'Backquote', label: '`', shiftLabel: '~', width: 1, finger: 'pinky', hand: 'left' },
    { code: 'Digit1', label: '1', shiftLabel: '!', width: 1, finger: 'pinky', hand: 'left' },
    { code: 'Digit2', label: '2', shiftLabel: '@', width: 1, finger: 'ring', hand: 'left' },
    { code: 'Digit3', label: '3', shiftLabel: '#', width: 1, finger: 'middle', hand: 'left' },
    { code: 'Digit4', label: '4', shiftLabel: '$', width: 1, finger: 'index', hand: 'left' },
    { code: 'Digit5', label: '5', shiftLabel: '%', width: 1, finger: 'index', hand: 'left' },
    { code: 'Digit6', label: '6', shiftLabel: '^', width: 1, finger: 'index', hand: 'right' },
    { code: 'Digit7', label: '7', shiftLabel: '&', width: 1, finger: 'index', hand: 'right' },
    { code: 'Digit8', label: '8', shiftLabel: '*', width: 1, finger: 'middle', hand: 'right' },
    { code: 'Digit9', label: '9', shiftLabel: '(', width: 1, finger: 'ring', hand: 'right' },
    { code: 'Digit0', label: '0', shiftLabel: ')', width: 1, finger: 'pinky', hand: 'right' },
    { code: 'Minus', label: '-', shiftLabel: '_', width: 1, finger: 'pinky', hand: 'right' },
    { code: 'Equal', label: '=', shiftLabel: '+', width: 1, finger: 'pinky', hand: 'right' },
    { code: 'Backspace', label: 'backspace', width: 2, finger: 'pinky', hand: 'right' },
  ],
  nav: [
    { code: 'Insert', label: 'ins', width: 1 },
    { code: 'Home', label: 'home', width: 1 },
    { code: 'PageUp', label: 'pg up', width: 1 },
  ],
  numpad: [
    { code: 'NumLock', label: 'num', width: 1 },
    { code: 'NumpadDivide', label: '/', width: 1 },
    { code: 'NumpadMultiply', label: '*', width: 1 },
    { code: 'NumpadSubtract', label: '-', width: 1 },
  ],
};

const row2: KeyboardRow = {
  main: [
    { code: 'Tab', label: 'tab', width: 1.5, finger: 'pinky', hand: 'left' },
    { code: 'KeyQ', label: 'q', width: 1, finger: 'pinky', hand: 'left' },
    { code: 'KeyW', label: 'w', width: 1, finger: 'ring', hand: 'left' },
    { code: 'KeyE', label: 'e', width: 1, finger: 'middle', hand: 'left' },
    { code: 'KeyR', label: 'r', width: 1, finger: 'index', hand: 'left' },
    { code: 'KeyT', label: 't', width: 1, finger: 'index', hand: 'left' },
    { code: 'KeyY', label: 'y', width: 1, finger: 'index', hand: 'right' },
    { code: 'KeyU', label: 'u', width: 1, finger: 'index', hand: 'right' },
    { code: 'KeyI', label: 'i', width: 1, finger: 'middle', hand: 'right' },
    { code: 'KeyO', label: 'o', width: 1, finger: 'ring', hand: 'right' },
    { code: 'KeyP', label: 'p', width: 1, finger: 'pinky', hand: 'right' },
    { code: 'BracketLeft', label: '[', shiftLabel: '{', width: 1, finger: 'pinky', hand: 'right' },
    { code: 'BracketRight', label: ']', shiftLabel: '}', width: 1, finger: 'pinky', hand: 'right' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', width: 1.5, finger: 'pinky', hand: 'right' },
  ],
  nav: [
    { code: 'Delete', label: 'del', width: 1 },
    { code: 'End', label: 'end', width: 1 },
    { code: 'PageDown', label: 'pg dn', width: 1 },
  ],
  numpad: [
    { code: 'Numpad7', label: '7', width: 1 },
    { code: 'Numpad8', label: '8', width: 1 },
    { code: 'Numpad9', label: '9', width: 1 },
    { code: 'NumpadAdd', label: '+', width: 1 },
  ],
};

const row3: KeyboardRow = {
  main: [
    { code: 'CapsLock', label: 'caps', width: 1.75, finger: 'pinky', hand: 'left' },
    { code: 'KeyA', label: 'a', width: 1, finger: 'pinky', hand: 'left', homeRow: true },
    { code: 'KeyS', label: 's', width: 1, finger: 'ring', hand: 'left', homeRow: true },
    { code: 'KeyD', label: 'd', width: 1, finger: 'middle', hand: 'left', homeRow: true },
    { code: 'KeyF', label: 'f', width: 1, finger: 'index', hand: 'left', homeRow: true },
    { code: 'KeyG', label: 'g', width: 1, finger: 'index', hand: 'left' },
    { code: 'KeyH', label: 'h', width: 1, finger: 'index', hand: 'right' },
    { code: 'KeyJ', label: 'j', width: 1, finger: 'index', hand: 'right', homeRow: true },
    { code: 'KeyK', label: 'k', width: 1, finger: 'middle', hand: 'right', homeRow: true },
    { code: 'KeyL', label: 'l', width: 1, finger: 'ring', hand: 'right', homeRow: true },
    {
      code: 'Semicolon',
      label: ';',
      shiftLabel: ':',
      width: 1,
      finger: 'pinky',
      hand: 'right',
      homeRow: true,
    },
    { code: 'Quote', label: "'", shiftLabel: '"', width: 1, finger: 'pinky', hand: 'right' },
    { code: 'Enter', label: 'enter', width: 2.25, finger: 'pinky', hand: 'right' },
  ],
  nav: [gap(3)],
  numpad: [
    { code: 'Numpad4', label: '4', width: 1 },
    { code: 'Numpad5', label: '5', width: 1 },
    { code: 'Numpad6', label: '6', width: 1 },
    gap(1),
  ],
};

const row4: KeyboardRow = {
  main: [
    { code: 'ShiftLeft', label: 'shift', width: 2.25, finger: 'pinky', hand: 'left' },
    { code: 'KeyZ', label: 'z', width: 1, finger: 'pinky', hand: 'left' },
    { code: 'KeyX', label: 'x', width: 1, finger: 'ring', hand: 'left' },
    { code: 'KeyC', label: 'c', width: 1, finger: 'middle', hand: 'left' },
    { code: 'KeyV', label: 'v', width: 1, finger: 'index', hand: 'left' },
    { code: 'KeyB', label: 'b', width: 1, finger: 'index', hand: 'left' },
    { code: 'KeyN', label: 'n', width: 1, finger: 'index', hand: 'right' },
    { code: 'KeyM', label: 'm', width: 1, finger: 'index', hand: 'right' },
    { code: 'Comma', label: ',', shiftLabel: '<', width: 1, finger: 'middle', hand: 'right' },
    { code: 'Period', label: '.', shiftLabel: '>', width: 1, finger: 'ring', hand: 'right' },
    { code: 'Slash', label: '/', shiftLabel: '?', width: 1, finger: 'pinky', hand: 'right' },
    { code: 'ShiftRight', label: 'shift', width: 2.75, finger: 'pinky', hand: 'right' },
  ],
  nav: [gap(1), { code: 'ArrowUp', label: '↑', width: 1 }, gap(1)],
  numpad: [
    { code: 'Numpad1', label: '1', width: 1 },
    { code: 'Numpad2', label: '2', width: 1 },
    { code: 'Numpad3', label: '3', width: 1 },
    { code: 'NumpadEnter', label: 'enter', width: 1 },
  ],
};

const row5: KeyboardRow = {
  main: [
    { code: 'ControlLeft', label: 'ctrl', width: 1.25, finger: 'pinky', hand: 'left' },
    { code: 'MetaLeft', label: 'win', width: 1.25, finger: 'pinky', hand: 'left' },
    { code: 'AltLeft', label: 'alt', width: 1.25, finger: 'thumb', hand: 'left' },
    { code: 'Space', label: 'space', width: 6.25, finger: 'thumb', hand: 'right' },
    { code: 'AltRight', label: 'alt gr', width: 1.25, finger: 'thumb', hand: 'right' },
    { code: 'MetaRight', label: 'win', width: 1.25, finger: 'pinky', hand: 'right' },
    { code: 'ContextMenu', label: 'menu', width: 1.25, finger: 'pinky', hand: 'right' },
    { code: 'ControlRight', label: 'ctrl', width: 1.25, finger: 'pinky', hand: 'right' },
  ],
  nav: [
    { code: 'ArrowLeft', label: '←', width: 1 },
    { code: 'ArrowDown', label: '↓', width: 1 },
    { code: 'ArrowRight', label: '→', width: 1 },
  ],
  numpad: [
    { code: 'Numpad0', label: '0', width: 2 },
    { code: 'NumpadDecimal', label: '.', width: 1 },
    gap(1),
  ],
};

export const ANSI_104: KeyboardLayout = {
  id: 'ansi-104',
  name: 'ANSI 104 (US)',
  locale: 'en-US',
  rows: [row0, row1, row2, row3, row4, row5],
};
