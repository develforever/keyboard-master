# Przekazanie do następnej sesji

Jeden plik, zawsze nadpisywany na końcu sesji przez `/km-session-end`.
Historia jest w `git log` i w `reports/` — tutaj wyłącznie stan i zadanie.

---

**Ostatnia aktualizacja:** 2026-08-15
**Faza:** 1 — Pętla sesji
**Gałąź:** `chore/struktura-i-dyscyplina` (do zmerge'owania przed startem fazy 1)
**Następne narzędzie:** Claude CLI

## Stan

Faza 0 zamknięta i **zweryfikowana w przeglądarce**. Architektura warstwowa stoi,
warstwa domenowa (punktacja, model klawiatury, challenge'e) ma 35 przechodzących
testów. Klawiatura renderuje się z danych, poprawnie obsługuje akordy i nie zacina
klawiszy po utracie fokusu.

Zweryfikowane automatycznie: `typecheck`, `lint`, `format:check`, `test` (35/35),
`next build` z React Compilerem.

Zweryfikowane w przeglądarce (szczegóły w `todo.md`): 104 klawisze bez duplikatów,
proporcje zgodne z modelem, akordy, `preventDefault` przepuszczające F5/F12/Ctrl+R,
brak zacinania po `blur`, czysta konsola bez ostrzeżeń hydratacji.

**Czego nie ma:** pętli gry. Nie da się przepisać tekstu ani zobaczyć wyniku.
Silnik punktacji istnieje, ale nic go jeszcze nie karmi danymi.

## Co dalej — w tej kolejności

1. **Zmerge'uj `chore/struktura-i-dyscyplina` do `main`.** Faza 1 startuje z czystego stanu.
2. **B-002** — podbicie `next` w obrębie 16.x (zgłoszona podatność). Krótkie,
   osobna gałąź, zamyka P1 przed dokładaniem kodu.
3. **F-005** — reduktor stanu sesji przepisywania. Pierwszy realny krok fazy 1.
4. Dalsze kroki i kryterium zamknięcia fazy: `todo.md` i `features.md`.

## Pułapki na start

- **Nie pracujemy na `main`** — najpierw gałąź.
- Komendy npm z katalogu głównego; podkatalog `app/` już nie istnieje.
- Weryfikacja wizualna wymaga uruchomionego `npm run dev` i przeglądarki
  użytkownika — sesja chmurowa nie dosięga `localhost`.
- `B-003` — `.nvmrc` deklaruje v25, lokalnie jest Node 22. CI buduje na innej
  wersji niż maszyna deweloperska. Do decyzji przy najbliższej okazji.

## Prompt 1 — B-002, podbicie Next.js

```
Projekt keyboard-master. Przeczytaj CLAUDE.md i bugs.md, potem zamknij B-002.

Podbij `next` i `eslint-config-next` do najnowszej wersji 16.x (nie przechodź na
17). Po podbiciu uruchom `npm run verify` oraz `npm run build` i sprawdź, czy
React Compiler nadal działa. Jeśli coś pęknie, zatrzymaj się i pokaż mi błąd
zamiast obchodzić problem.

Po zielonym buildzie przenieś B-002 do sekcji "Naprawione" w bugs.md z datą
i wersją, do której podbiliśmy. Nie commituj na main — załóż gałąź
fix/B-002-next-security i wypluj mi listę poleceń do PowerShell 7.
```

## Prompt 2 — F-005, stan sesji przepisywania

```
Projekt keyboard-master, faza 1. Przeczytaj CLAUDE.md, docs/NEXT-SESSION.md,
todo.md i src/domain/engine/ (types.ts, scoring.ts), potem zaimplementuj F-005.

Zakres: reduktor stanu sesji przepisywania w src/domain/engine/session.ts —
czysty TypeScript, zero zależności od Reacta. Stan trzyma pozycję w tekście,
listę Keystroke[] i moment startu. Akcje: start, keystroke, finish.

Wymagania, których nie wolno pominąć:
- timer startuje przy PIERWSZYM znaku, nie przy załadowaniu tekstu
- klawisze sterujące (Shift, Ctrl, Alt, Meta) nie przesuwają pozycji i nie
  trafiają do statystyk
- Backspace cofa pozycję i oznacza znak jako poprawiony; poprawione błędy nie
  obniżają WPM netto, ale obniżają celność — jeśli uważasz, że to zła decyzja,
  powiedz mi to przed implementacją
- typ akcji jako domknięta suma z wyczerpującym switchem (const _: never)

Kolejność pracy: najpierw testy w session.test.ts, potem implementacja.
Przypadki brzegowe obowiązkowo: pusty tekst, tekst jednoznakowy, sesja bez
ani jednego poprawnego znaku, Backspace na pozycji 0, keystroke po finish.

Dopiero po zielonych testach podepnij store w
src/application/stores/useSessionStore.ts i połącz z onKeyEvent z Keyboard.tsx.
Nie buduj jeszcze UI — to F-006 i F-007.

Na koniec zaktualizuj todo.md i features.md, nie commituj na main, załóż gałąź
feat/F-005-stan-sesji i wypluj mi listę poleceń do PowerShell 7.
```
