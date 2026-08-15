---
name: km-session-end
description: Zamyka sesję pracy nad keyboard-master — weryfikacja, aktualizacja features/todo/bugs, raport HTML, przekazanie do następnej sesji i polecenia gita dla PowerShell 7. Użyj, gdy użytkownik kończy sesję, prosi o podsumowanie albo mówi, że na dziś koniec.
---

# Zamknięcie sesji — keyboard-master

Kolejność jest istotna: dokumentacja przed raportem, raport przed przekazaniem.

## 1. Weryfikacja

Uruchom `/km-verify`. Jeśli coś jest czerwone, zapytaj użytkownika, czy zamykamy
sesję z długiem — i wtedy dopisz to jako wpis w `bugs.md`, a nie jako zdanie
w podsumowaniu, które nikt nie przeczyta.

## 2. Aktualizacja pamięci projektu

| Plik          | Co aktualizujesz                                                     |
| ------------- | -------------------------------------------------------------------- |
| `features.md` | statusy ficzerów; nowy zakres tylko po decyzji użytkownika           |
| `todo.md`     | odhaczone kroki; przy zamknięciu fazy — przepisanie kroków następnej |
| `bugs.md`     | nowe defekty z krokami odtworzenia, naprawione do sekcji z datą      |
| `README.md`   | tylko jeśli zmieniły się komendy lub struktura                       |
| `docs/adr/`   | nowy wpis, jeśli w sesji zapadła decyzja architektoniczna            |

Zasada nadrzędna: **zadanie istnieje w dokładnie jednym pliku.** Jeśli ten sam
element jest w `todo.md` i `features.md` jako osobny wpis, jeden z nich usuń.

## 3. Raport

Uruchom `/km-report` z ID i tytułem ficzera zamykanego w tej sesji.

## 4. Przekazanie do następnej sesji

Nadpisz `docs/NEXT-SESSION.md` w całości — to jest jeden plik stanu, nie dziennik.
Historia jest w `git log` i w `reports/`.

Musi zawierać:

- datę, numer fazy, aktualną gałąź
- **stan** — co działa, a co jeszcze nie; czego nie zweryfikowano
- **co dalej** — 2–4 konkretne kroki
- pułapki, o których następna sesja nie może nie wiedzieć
- **gotowy prompt do wklejenia** w bloku kodu

Prompt pisz tak, żeby wykonała go sesja bez żadnego kontekstu z tej rozmowy.
Ma wskazywać pliki do przeczytania, zadanie i sposób pracy. Jeśli prompt wymaga
dopowiedzenia od użytkownika, jest za słaby.

## 5. Polecenia gita

Użytkownik pracuje na **Windows z PowerShell 7** i sam wykonuje polecenia.
Nie uruchamiaj gita za niego.

Zasady:

- **Nigdy na `main`.** Najpierw sprawdź: `git rev-parse --abbrev-ref HEAD`.
  Jeśli to `main` — pierwszym poleceniem musi być założenie gałęzi.
- Nazwa gałęzi: `feat/F-005-krotki-opis`, `fix/B-002-krotki-opis`,
  `chore/opis` dla zmian bez ID.
- Conventional Commits z ID w treści:
  `feat(engine): F-005 reduktor stanu sesji przepisywania`
- Wydaj **gotową listę poleceń w jednym bloku**, do skopiowania w całości.
- W PowerShell używaj `;` do łączenia poleceń. Treści commitów z apostrofem
  albo `$` ujmuj w cudzysłów pojedynczy, żeby uniknąć interpolacji.

Szablon:

```powershell
# uruchamiane z katalogu repozytorium
git rev-parse --abbrev-ref HEAD          # kontrola: nie pracujemy na main
git switch -c feat/F-005-stan-sesji
git add -A
git commit -m 'feat(engine): F-005 reduktor stanu sesji przepisywania'
git push -u origin feat/F-005-stan-sesji
```

## 6. Podsumowanie dla użytkownika

Kilka zdań prozą: co zrobiliśmy, co zostało otwarte, co jest następne.
Bez powtarzania list, które są już w plikach i w raporcie.
