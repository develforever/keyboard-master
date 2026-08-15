# Przekazanie do następnej sesji

Jeden plik, zawsze nadpisywany na końcu sesji przez `/km-session-end`.
Historia jest w `git log` i w `reports/` — tutaj wyłącznie stan i zadanie.

---

**Ostatnia aktualizacja:** 2026-08-15
**Faza:** 1 — Pętla sesji
**Gałąź:** `main` (wszystko zmerge'owane)
**Repozytorium:** publiczne — https://github.com/develforever/keyboard-master
**Następne narzędzie:** Claude CLI

## Stan

Faza 0 zamknięta, zweryfikowana w przeglądarce i zmerge'owana do `main`.
Architektura warstwowa stoi, warstwa domenowa (punktacja, model klawiatury,
challenge'e) ma 35 przechodzących testów. Klawiatura renderuje się z danych,
obsługuje akordy i nie zacina klawiszy po utracie fokusu. Projekt stoi na
Node 24.15.0.

Zweryfikowane automatycznie: `typecheck`, `lint`, `format:check`, `test` (35/35),
`next build` z React Compilerem.

Zweryfikowane w przeglądarce (szczegóły w `todo.md`): 104 klawisze bez duplikatów,
proporcje zgodne z modelem, akordy, `preventDefault` przepuszczające F5/F12/Ctrl+R,
brak zacinania po `blur`, czysta konsola bez ostrzeżeń hydratacji.

**Czego nie ma:** pętli gry. Nie da się przepisać tekstu ani zobaczyć wyniku.
Silnik punktacji istnieje, ale nic go jeszcze nie karmi danymi.

**CI nie przebiegł ani razu.** Pierwszy push na `main` po upublicznieniu repo
będzie pierwszym prawdziwym testem `.github/workflows/ci.yml` — spodziewaj się,
że coś tam trzeba będzie dostroić.

## Co dalej — w tej kolejności

1. **B-002** — podbicie `next` w obrębie 16.x. Po upublicznieniu repo graf
   zależności jest widoczny dla wszystkich, więc podatna wersja też. To teraz
   najpilniejsza pozycja.
2. **Domknięcie spraw repo publicznego** — `LICENSE`, Dependabot, opis i tematy.
   Lista w `todo.md`, sekcja „Repozytorium publiczne".
3. **F-005** — reduktor stanu sesji przepisywania. Pierwszy realny krok fazy 1.
4. Dalsze kroki i kryterium zamknięcia fazy: `todo.md` i `features.md`.

## Pułapki na start

- **Nie pracujemy na `main`** — najpierw gałąź.
- Lokalne repo bywa w tyle za GitHubem, bo merge'e szły przez interfejs webowy.
  Zaczynaj od `git switch main; git pull`.
- Komendy npm z katalogu głównego; podkatalog `app/` już nie istnieje.
- Node 24.15.0 z `.nvmrc` (`nvm install 24.15.0; nvm use 24.15.0` — maszyna
  deweloperska stała na 24.14.0). Tylko wersje parzyste, pin dokładny, bez BOM —
  zasady w `docs/adr/0004`.
- Weryfikacja wizualna wymaga uruchomionego `npm run dev` i przeglądarki
  użytkownika — sesja chmurowa nie dosięga `localhost`.
- Pliki konfiguracyjne pisane z PowerShella zapisuj przez `-Encoding utf8NoBOM`
  (patrz B-013).

## Prompt 1 — B-002, podbicie Next.js

```
Projekt keyboard-master. Przeczytaj CLAUDE.md i bugs.md, potem zamknij B-002.

Zacznij od git switch main; git pull — lokalne repo może być w tyle.

Podbij `next` i `eslint-config-next` do najnowszej wersji 16.x (nie przechodź na
17). Po podbiciu uruchom `npm run verify` oraz `npm run build` i sprawdź, czy
React Compiler nadal działa. Jeśli coś pęknie, zatrzymaj się i pokaż mi błąd
zamiast obchodzić problem.

Repo jest publiczne, więc przy okazji sprawdź, czy `npm audit` pokazuje coś
jeszcze w zależnościach produkcyjnych. Nie naprawiaj tego w tym samym commicie —
jeśli coś znajdziesz, dopisz jako nowy wpis do bugs.md.

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
