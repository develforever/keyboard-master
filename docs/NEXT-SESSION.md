# Przekazanie do następnej sesji

Jeden plik, zawsze nadpisywany na końcu sesji przez `/km-session-end`.
Nie dopisujemy historii — od tego jest `git log` i raporty w `reports/`.

---

**Ostatnia aktualizacja:** 2026-08-15
**Faza:** 1 — Pętla sesji
**Gałąź:** `main` (faza 0 zamknięta, gałąź fazy 1 jeszcze nie utworzona)

## Stan

Faza 0 zamknięta. Architektura warstwowa stoi, warstwa domenowa (punktacja,
model klawiatury, challenge'e) jest zaimplementowana i pokryta 35 testami.
Klawiatura renderuje się z danych i reaguje na fizyczne klawisze, ale **nie ma
jeszcze pętli gry** — nie da się przepisać tekstu ani zobaczyć wyniku.

Zweryfikowane w tej sesji: `typecheck`, `lint`, `format:check`, `test` (35/35),
`next build` z włączonym React Compilerem. Weryfikacja wizualna w przeglądarce
jeszcze nie przeprowadzona — to pierwsza rzecz do zrobienia.

## Co dalej

1. **Weryfikacja wizualna** — uruchom `npm run dev`, ja podepnę się przez Claude
   in Chrome: proporcje klawiszy, podświetlenia, akordy (Shift+A), brak zacinania
   po Alt+Tab, czysta konsola.
2. **F-005** — stan sesji przepisywania. Reduktor w `domain/engine/session.ts`,
   testy przed podpięciem do UI.
3. Dalsze kroki: `todo.md`.

## Znane pułapki na start

- Nie pracujemy na `main` — najpierw gałąź `feat/F-005-stan-sesji`.
- Komendy npm wyłącznie z katalogu `app/`.
- `B-002` — `next@16.0.8` ma podatność, warto zamknąć przed fazą 2.

## Prompt do wklejenia w następnej sesji

```
Kontynuujemy keyboard-master, faza 1 (pętla sesji). Przeczytaj CLAUDE.md,
docs/NEXT-SESSION.md, todo.md i bugs.md, potem podsumuj mi w 3 zdaniach, gdzie
jesteśmy i co robimy w tej sesji.

Zaczynamy od weryfikacji wizualnej: odpalam `npm run dev` na localhost:3000,
podepnij się przez Claude in Chrome i sprawdź proporcje klawiszy, podświetlenia,
akordy Shift+A i Ctrl+Alt+Delete, zacinanie klawiszy po utracie fokusu okna oraz
błędy w konsoli. Zrób maksymalnie 3 zrzuty. Znalezione defekty dopisz do bugs.md
z krokami odtworzenia.

Potem F-005 ze `todo.md` — reduktor stanu sesji w domain/engine/session.ts.
Najpierw testy, potem implementacja, na końcu podpięcie do UI. Nie pracuj na
main, załóż gałąź feat/F-005-stan-sesji i wypluj mi polecenia do PowerShell 7.
```
