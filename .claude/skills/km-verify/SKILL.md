---
name: km-verify
description: Pełna weryfikacja zmian w keyboard-master wg Definition of Done — typy, lint, format, testy, kierunek zależności i aktualność dokumentacji. Użyj przed commitem, przed zamknięciem ficzera lub gdy użytkownik pyta, czy zmiany są gotowe.
---

# Weryfikacja zmian — keyboard-master

Bramka jakości. Nie raportuj „gotowe", dopóki wszystkie punkty nie przejdą.

## 1. Zestaw automatyczny

Z katalogu głównego repo (nie ma już podkatalogu `app/`):

```bash
npm run verify
```

To uruchamia po kolei `typecheck`, `lint` i `test`. Gdy któryś padnie — napraw
przyczynę, nie obchodź jej. Wyłączenie reguły lintera wymaga komentarza
z uzasadnieniem w tej samej linii.

Osobno, bo `verify` tego nie obejmuje:

```bash
npm run format:check
```

## 2. Kierunek zależności

Reguła `no-restricted-imports` pilnuje `src/domain/**`, ale nie pokrywa reszty.
Sprawdź ręcznie, że nowe importy nie odwracają strzałek:

```
components → application → domain
infrastructure → (implementuje) application/ports
```

Czerwone flagi: `@/components` w `application/`, `@/infrastructure` w `application/`
poza plikiem montującym, jakikolwiek import frameworka w `domain/`.

## 3. Pokrycie testami nowej logiki

Każda nowa funkcja w `src/domain/**` ma test. Sprawdź przypadki brzegowe —
w tym projekcie regularnie wychodzą właśnie tam:

- zerowy czas trwania, pusty ciąg naciśnięć, zero znaków
- sesja złożona wyłącznie z błędów
- wartości brzegowe progów (`>=` czy `>`)
- warianty sum typów — czy `switch` ma gałąź `never`

## 4. Reguły specyficzne dla klawiatury

Przy zmianach w obsłudze wejścia sprawdź:

- identyfikacja przez `KeyboardEvent.code`, nigdy `key`
- `preventDefault()` tylko dla kodów z `SWALLOWED_CODES` i nigdy przy Ctrl/Meta/Alt
- brak `stopPropagation()` na `window`
- zwolnienie klawiszy przy `blur` / `visibilitychange`
- brak ręcznych `useMemo` / `useCallback` — React Compiler jest włączony

## 5. Dokumentacja

- `features.md` — status ficzera zaktualizowany
- `todo.md` — odhaczone kroki
- `bugs.md` — naprawione bugi przeniesione do sekcji „Naprawione" z datą
- `docs/adr/` — nowy wpis, jeśli zmiana jest architektoniczna
- `README.md` — aktualny, jeśli zmieniły się komendy lub struktura

## Raport

Podaj krótko: co przeszło, co padło, co wymaga decyzji użytkownika.
Nie wypisuj pełnego logu narzędzi, chyba że coś jest czerwone.
