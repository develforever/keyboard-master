/**
 * Model fizycznej klawiatury. Warstwa domenowa — zero zależności od Reacta,
 * DOM-u czy stylowania. `KeyCode` odpowiada `KeyboardEvent.code` (niezależne
 * od układu językowego), a nie `KeyboardEvent.key`.
 */

/** Wartość `KeyboardEvent.code`, np. "KeyA", "ShiftLeft", "Numpad7". */
export type KeyCode = string;

/** Palec przypisany do klawisza w metodzie bezwzrokowej (touch typing). */
export type Finger = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';

/** Ręka obsługująca klawisz. */
export type Hand = 'left' | 'right';

/** Blok fizyczny klawiatury 104-klawiszowej. */
export type KeyboardSection = 'main' | 'nav' | 'numpad';

/**
 * Pojedyncze pole w siatce klawiatury.
 * `code === null` oznacza pole dekoracyjne lub wypełniacz (diody, logo, przerwa)
 * — nigdy nie reaguje na zdarzenia i nie jest liczone do statystyk.
 */
export interface KeyDef {
  readonly code: KeyCode | null;
  /** Etykieta widoczna na klawiszu. */
  readonly label: string;
  /** Druga etykieta (znak z Shiftem), np. "!" nad "1". */
  readonly shiftLabel?: string;
  /** Szerokość w jednostkach 1u (1u = szerokość klawisza literowego). */
  readonly width: number;
  readonly finger?: Finger;
  readonly hand?: Hand;
  /** Klawisz spoczynkowy (ASDF / JKL;) — używany w challenge'ach na pozycję rąk. */
  readonly homeRow?: boolean;
}

/** Jeden rząd klawiatury rozbity na trzy bloki fizyczne. */
export interface KeyboardRow {
  readonly main: readonly KeyDef[];
  readonly nav: readonly KeyDef[];
  readonly numpad: readonly KeyDef[];
}

/** Kompletny układ klawiatury. */
export interface KeyboardLayout {
  readonly id: string;
  readonly name: string;
  /** Kod ISO języka, np. "en-US", "pl". */
  readonly locale: string;
  readonly rows: readonly KeyboardRow[];
}

/** Szerokość bloku w jednostkach 1u — stała dla wszystkich rzędów. */
export const SECTION_WIDTH: Readonly<Record<KeyboardSection, number>> = {
  main: 15,
  nav: 3,
  numpad: 4,
};
