# TODO — Faza 1: Pętla sesji

Wyłącznie bieżąca faza, rozbita na wykonalne kroki. Zamknięcie fazy = wyczyszczenie
tego pliku i przepisanie kroków następnej fazy z `features.md`.

Zakres fazy i kryterium jej ukończenia: `features.md`.

---

## F-005 — Stan sesji przepisywania

- [ ] `domain/engine/session.ts` — czysty reduktor: `SessionState` + akcje
      `start` / `keystroke` / `finish`, bez zależności od Reacta
- [ ] Obsługa `Backspace` — cofnięcie pozycji, oznaczenie znaku jako poprawionego
      (decyzja: poprawione błędy nie obniżają WPM netto, obniżają celność)
- [ ] Pominięcie klawiszy sterujących (Shift, Ctrl, Alt) — nie przesuwają pozycji
- [ ] Timer startuje przy pierwszym znaku, nie przy załadowaniu tekstu
- [ ] Testy: pusty tekst, tekst jednoznakowy, same błędy, backspace na pozycji 0
- [ ] `application/stores/useSessionStore.ts` — zustand, spina reduktor ze strumieniem

## F-006 — Podpowiedź klawisza

- [ ] `nextKeyCode(text, position)` — mapowanie znaku na `KeyCode` przez `indexByCode`
- [ ] Obsługa znaków wymagających Shifta — podpowiedź dwóch klawiszy naraz
- [ ] Komponent tekstu: znak bieżący, znaki poprawne, znaki błędne, znaki przed nami
- [ ] Przewijanie tekstu, gdy pozycja wychodzi poza widok
- [ ] Testy: znak spoza układu, znak z `shiftLabel`, koniec tekstu

## F-007 — HUD na żywo

- [ ] Komponent HUD: WPM netto, celność, combo, pasek postępu
- [ ] Przeliczanie metryk nie częściej niż co 200 ms — nie na każde naciśnięcie
- [ ] Combo widoczne dopiero od progu 10 (niżej to szum)
- [ ] Story w Storybooku dla stanów: start, seria, po błędzie, koniec

## F-008 — Ekran wyniku

- [ ] Rozbicie metryk z `SessionMetrics` + wynik punktowy
- [ ] Porównanie z rekordem z `ProgressRepository`
- [ ] Przycisk powtórzenia i przejścia do listy challenge'y (stub do fazy 2)

---

## Dług do spłacenia w tej fazie

- [ ] Rewizja `AppContext` — `lang` i `isReady` pochodzą ze scaffoldingu, `isReady`
      dubluje stan ładowania w `ToTranscribe` (patrz B-005)
- [ ] Usunąć `app/_to_delete/` (patrz B-004)
