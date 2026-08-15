# ADR 0003 — Układ klawiatury jako dane, nie JSX

- **Status:** przyjęte
- **Data:** 2026-08-15

## Kontekst

`Keyboard.tsx` zawierał ~140 linii ręcznie wypisanego JSX — po jednym `<div>` na
klawisz, z kodem klawisza wpisanym jako literał w wywołaniu funkcji budującej klasy.

Ten kształt wygenerował konkretne błędy, nie hipotetyczne:

- `Enter` występował **dwa razy** (rząd główny i numpad) — naciśnięcie Entera
  podświetlało oba. Numpad ma kod `NumpadEnter`.
- `Backslash` występował dwa razy. Drugie wystąpienie to w układzie ISO klawisz
  `IntlBackslash`, a w ANSI go w ogóle nie ma.
- Kilkanaście pól miało `makeActiveClass('')` — pusty kod klawisza jako wypełniacz,
  nieodróżnialny w kodzie od realnego klawisza.
- Szerokości klawiszy nie istniały: Escape, Backspace i Spacja renderowały się
  identycznie, bo każde pole dostawało `flex: 1`.
- Dodanie układu ISO/PL oznaczało skopiowanie całego bloku JSX i ręczną edycję.

Aplikacja ma docelowo wspierać wiele układów (ANSI, ISO/PL, TKL, 60%) i ćwiczenia
przypisane do palców — obie rzeczy są niewykonalne, gdy topologia jest w JSX.

## Decyzja

Topologia klawiatury to **dane** w warstwie domenowej:

```ts
KeyDef        { code, label, shiftLabel?, width, finger?, hand?, homeRow? }
KeyboardRow   { main, nav, numpad }        // trzy bloki fizyczne
KeyboardLayout{ id, name, locale, rows }
```

`Keyboard.tsx` sprowadza się do dwóch zagnieżdżonych `map`. Nowy układ = nowy plik
w `domain/keyboard/layouts/`, zero zmian w komponencie.

Szerokości w jednostkach `1u` (szerokość klawisza literowego); renderowane przez
`flexGrow: width, flexBasis: 0`. Każdy rząd sumuje się do stałej z `SECTION_WIDTH`
(main 15u, nav 3u, numpad 4u) — pilnuje tego test, więc literówka w szerokości
wywala CI, a nie układ na produkcji.

Pola dekoracyjne mają `code: null` — typ, nie pusty string. TypeScript wymusza
obsłużenie tego przypadku wszędzie, gdzie kod klawisza jest używany.

Adnotacje `finger`, `hand` i `homeRow` są częścią danych układu, bo z nich będą
generowane ćwiczenia („tylko lewa ręka", „tylko palec wskazujący") i statystyki
błędów per palec.

## Konsekwencje

**Pozytywne**

- Duplikaty kodów są niemożliwe do przeoczenia — test `layout.test.ts` je wykrywa.
- Klawisze mają realne proporcje.
- Silnik gry dostaje `indexByCode()` — mapę `code → KeyDef` z informacją o palcu,
  gotową pod podpowiedzi i statystyki.
- Dane układu są serializowalne, więc edytor układów w przyszłości nie wymaga
  zmian w modelu.

**Negatywne**

- Plik z układem ma ~230 linii danych. To celowo nudny plik — jego rolą jest być
  jedynym miejscem, gdzie topologia w ogóle występuje.
- Renderer oparty na rzędach flex nie odwzorowuje klawiszy wysokich na 2u
  (`NumpadAdd`, `NumpadEnter`). Pod nimi jest wypełniacz. Naprawa wymaga
  renderera bloku numpad na CSS Grid — odłożone, bo nie blokuje rozgrywki.

**Do rewizji, gdy** dojdzie drugi układ z inną liczbą klawiszy w rzędzie (ISO ma
`IntlBackslash`) — wtedy warto zweryfikować, czy podział na trzy bloki wystarcza.
