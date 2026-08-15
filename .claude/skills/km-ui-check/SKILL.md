---
name: km-ui-check
description: Wizualna i behawioralna weryfikacja keyboard-master w przeglądarce przez Claude in Chrome — zrzuty, konsola, test akordów i zacinania klawiszy. Użyj po zmianach w UI, w komponentach klawiatury albo gdy użytkownik uruchomił dev server.
---

# Weryfikacja UI w przeglądarce — keyboard-master

Testy jednostkowe nie wykryją źle rozłożonych klawiszy, brakującego podświetlenia
ani klawisza, który zaciął się po Alt+Tab. To robi ten przebieg.

## Warunek wstępny

Użytkownik musi mieć uruchomiony `npm run dev`. Jeśli nie masz pewności — zapytaj,
zanim zaczniesz. Nie uruchamiaj dev servera sam: w sesji chmurowej i tak nie
dosięgniesz jego `localhost`.

## Kolejność

1. `mcp__claude-in-chrome__tabs_context_mcp` — sprawdź istniejące karty.
   Nie używaj ponownie ID kart z poprzedniej sesji.
2. Nową kartą na `http://localhost:3000`.
3. `read_console_messages` z filtrem `pattern` — najpierw błędy, nie cały log.

## Lista kontrolna

**Proporcje i układ**

- Spacja jest wyraźnie najszersza, Backspace i Shift szersze od klawiszy literowych
- Trzy bloki (główny, nawigacja, numpad) są rozdzielone przerwą
- Etykiety nie są ucięte przy szerokości okna 1280 i 1920
- Klawisze spoczynkowe (ASDF / JKL;) mają znacznik

**Reakcja na klawisze**

Wyślij zdarzenia przez `computer` (akcja `key`) i po każdym zrób odczyt:

- pojedyncza litera — podświetla się dokładnie jeden klawisz
- `Shift+a` — podświetlone **oba** klawisze naraz
- `ctrl+alt+Delete` — sprawdź, że aplikacja nie blokuje kombinacji
- `F5` i `F12` **nie mogą** być przechwycone przez aplikację

**Zacinanie klawiszy**

Najczęstszy błąd w tej klasie aplikacji. Przytrzymaj klawisz, odbierz fokus oknu
(przełącz kartę), wróć — żaden klawisz nie może zostać podświetlony.

**Konsola**

Zero błędów. Ostrzeżenia o hydratacji traktuj jak błąd — root layout jest
komponentem serwerowym i nie powinien ich generować.

## Zrzuty

Maksymalnie **3 na ficzer**. Każdy zrzut kosztuje realny kontekst; dziesięć
zrzutów oznacza brak miejsca na kod.

Zapisuj do `reports/.shots/` w konwencji `NN-nazwa.png`, a obok plik
`NN-nazwa.txt` z jednozdaniowym podpisem — generator raportu podstawi go
jako podpis pod obrazkiem.

## Czego nie robić

- Nie klikaj elementów mogących wywołać `alert` / `confirm` — modal blokuje
  wszystkie kolejne polecenia rozszerzenia i sesja przestaje odpowiadać.
- Po dwóch–trzech nieudanych próbach tej samej akcji zatrzymaj się i zapytaj.

## Wynik

Znalezione defekty dopisz do `bugs.md` z krokami odtworzenia i priorytetem.
Defekt bez kroków odtworzenia nie jest bugiem — jego miejsce jest w `features.md`.
