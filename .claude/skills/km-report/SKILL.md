---
name: km-report
description: Generuje raport HTML sesji dla keyboard-master ze zrzutami, postępem fazy, bugami i commitami. Użyj po zamknięciu ficzera albo gdy użytkownik prosi o podsumowanie prac.
---

# Raport sesji — keyboard-master

Raport jest **generowany**, nie redagowany. Ręczne pisanie raportów zamienia
sesje kodowania w sesje dokumentacyjne.

## Przed generowaniem

Uzupełnij źródła, z których raport czyta — bez tego wyjdzie pusty:

1. `features.md` — status ficzera (`planowane` → `w toku` → `gotowe`)
2. `todo.md` — odhaczone kroki
3. `bugs.md` — nowe defekty; naprawione przeniesione do sekcji „Naprawione"
4. `reports/.shots/` — zrzuty z `/km-ui-check` z podpisami w plikach `.txt`

## Generowanie

```bash
npm run report -- --feature F-005 --title "Stan sesji przepisywania"
```

Parametry opcjonalne: `--shots <katalog>` (domyślnie `reports/.shots`),
`--out <katalog>` (domyślnie `reports`).

Wynik: `reports/raport-<data>-<ID>-<slug>.html` — jeden samowystarczalny plik.
Zrzuty są wklejone jako `data:` URL, więc nie ma folderu z zasobami i raport
otwiera się wszędzie.

## Po wygenerowaniu

- Sprawdź rozmiar. Powyżej ~4 MB oznacza za dużo albo za duże zrzuty —
  przytnij je, zamiast puszczać dalej.
- W sesji Cowork wyślij plik użytkownikowi przez `SendUserFile`.
- `reports/` jest w `.gitignore` — nie commituj raportu i nie proponuj tego.

## Czego raport nie zastępuje

Raport pokazuje, co się wydarzyło. Nie zastępuje `docs/NEXT-SESSION.md`, który
mówi, co robić dalej — to dwa różne dokumenty i oba są potrzebne.
