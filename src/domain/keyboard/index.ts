import type { KeyCode, KeyDef, KeyboardLayout } from './types';

export * from './types';
export { ANSI_104 } from './layouts/ansi104';

/** Zwraca wszystkie realne (niedekoracyjne) klawisze układu. */
export function listKeys(layout: KeyboardLayout): readonly KeyDef[] {
  return layout.rows.flatMap((row) =>
    [...row.main, ...row.nav, ...row.numpad].filter((key) => key.code !== null),
  );
}

/** Buduje indeks `code -> KeyDef` dla szybkiego wyszukiwania w silniku gry. */
export function indexByCode(layout: KeyboardLayout): ReadonlyMap<KeyCode, KeyDef> {
  const index = new Map<KeyCode, KeyDef>();

  for (const key of listKeys(layout)) {
    if (key.code !== null && !index.has(key.code)) {
      index.set(key.code, key);
    }
  }

  return index;
}
