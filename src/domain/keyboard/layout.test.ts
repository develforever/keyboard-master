import { describe, expect, it } from 'vitest';

import { ANSI_104, indexByCode, listKeys } from './index';
import { SECTION_WIDTH, type KeyboardSection } from './types';

const SECTIONS: readonly KeyboardSection[] = ['main', 'nav', 'numpad'];

describe('ANSI_104', () => {
  it.each(SECTIONS)('każdy rząd bloku "%s" ma zadeklarowaną szerokość', (section) => {
    ANSI_104.rows.forEach((row, rowIndex) => {
      const total = row[section].reduce((sum, key) => sum + key.width, 0);

      expect(total, `rząd ${rowIndex}, blok ${section}`).toBeCloseTo(SECTION_WIDTH[section], 5);
    });
  });

  it('nie zawiera zduplikowanych kodów klawiszy', () => {
    const codes = listKeys(ANSI_104).map((key) => key.code);
    const duplicates = codes.filter((code, index) => codes.indexOf(code) !== index);

    expect(duplicates).toEqual([]);
  });

  it('rozróżnia Enter główny od NumpadEnter', () => {
    const index = indexByCode(ANSI_104);

    expect(index.has('Enter')).toBe(true);
    expect(index.has('NumpadEnter')).toBe(true);
  });

  it('oznacza dokładnie osiem klawiszy spoczynkowych', () => {
    const homeRow = listKeys(ANSI_104).filter((key) => key.homeRow);

    expect(homeRow.map((key) => key.code)).toEqual([
      'KeyA',
      'KeyS',
      'KeyD',
      'KeyF',
      'KeyJ',
      'KeyK',
      'KeyL',
      'Semicolon',
    ]);
  });

  it('każdy realny klawisz ma niepustą etykietę i dodatnią szerokość', () => {
    for (const key of listKeys(ANSI_104)) {
      expect(key.label.length, `klawisz ${key.code}`).toBeGreaterThan(0);
      expect(key.width, `klawisz ${key.code}`).toBeGreaterThan(0);
    }
  });

  it('przypisuje palec i rękę wszystkim klawiszom alfanumerycznym', () => {
    const alphanumeric = listKeys(ANSI_104).filter(
      (key) => key.code?.startsWith('Key') || key.code?.startsWith('Digit'),
    );

    expect(alphanumeric.length).toBe(36);

    for (const key of alphanumeric) {
      expect(key.finger, `klawisz ${key.code}`).toBeDefined();
      expect(key.hand, `klawisz ${key.code}`).toBeDefined();
    }
  });
});
