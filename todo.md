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
- [ ] Ograniczyć szerokość bloku tekstu (`max-w-3xl`) — przy 1568 px linie są
      za długie, oko gubi pozycję przy przepisywaniu

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

## Zweryfikowane w przeglądarce 2026-08-15

Nie wymaga działań — zapis, żeby nie sprawdzać drugi raz:

- [x] 104 realne klawisze, zero duplikatów kodów, `Enter` i `NumpadEnter` rozdzielone
- [x] Proporcje zgodne z modelem (spacja 6,15u, Shift 2,17u, Backspace 1,90u)
- [x] Akordy: Shift+A i Ctrl+Alt+Del podświetlają wszystkie klawisze naraz
- [x] F5, F12, Escape, Ctrl+R, Ctrl+W nie są przechwytywane przez aplikację
- [x] Spacja, Tab, strzałki i Backspace są przechwytywane (zgodnie z zamysłem)
- [x] Utrata fokusu okna czyści wciśnięte klawisze — brak zacinania
- [x] Auto-powtarzanie nie duplikuje stanu
- [x] Konsola czysta, zero ostrzeżeń hydratacji

## Repozytorium publiczne — do domknięcia

Repo jest publiczne od 2026-08-15. Rzeczy, które wcześniej nie miały znaczenia:

- [ ] **Wgrać `LICENSE`** z pełnym tekstem AGPL-3.0 (decyzja: `docs/adr/0005`).
      Najprościej przez GitHub → Add file → Create new file → nazwa `LICENSE`
      → przycisk „Choose a license template" → GNU AGPLv3. Ta droga daje
      dokładny tekst i włącza wykrywanie licencji przez GitHuba.
- [ ] **Odnośnik do źródeł w interfejsie aplikacji** — wymóg §13 AGPL.
      Widoczny link do repozytorium w stopce, wskazujący konkretną wersję.
      **Musi być przed pierwszym publicznym wdrożeniem**; przy pracy lokalnej
      obowiązek się nie aktywuje, więc nie blokuje fazy 1.
- [ ] **Włączyć Dependabot** (Settings → Code security). Dla repo publicznych
      za darmo; przy otwartym B-002 to konkretna wartość, a nie formalność.
- [ ] Uzupełnić opis i tematy repozytorium — obecnie „Keyboard games",
      README mówi znacznie więcej.
- [ ] Rozważyć `CONTRIBUTING.md`, jeśli repo ma przyjmować zgłoszenia.

## Dług do spłacenia w tej fazie

- [ ] Rewizja `AppContext` — `lang` i `isReady` pochodzą ze scaffoldingu, `isReady`
      dubluje stan ładowania w `ToTranscribe` (patrz B-005)
- [ ] Usunąć `app/_to_delete/` (patrz B-004)
