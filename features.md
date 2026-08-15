# Features — roadmapa

Źródło prawdy dla zakresu. Każdy ficzer ma ID `F-xxx`, które trafia do nazwy gałęzi,
treści commita i raportu. Statusy: `planowane` → `w toku` → `gotowe`.

Rozbicie bieżącej fazy na kroki jest w `todo.md`. Defekty w `bugs.md`.
Ficzer nie może być jednocześnie w dwóch plikach.

---

## Faza 0 — Fundament ✅ gotowe

| ID    | Ficzer                                       | Status |
| ----- | -------------------------------------------- | ------ |
| F-000 | Architektura warstwowa, porty i adaptery     | gotowe |
| F-001 | Układ klawiatury jako dane + renderer        | gotowe |
| F-002 | Silnik punktacji (WPM, celność, rytm, combo) | gotowe |
| F-003 | Model challenge'y i ewaluacja celów          | gotowe |
| F-004 | Setup jakości: Vitest, Prettier, CI, hooki   | gotowe |

## Faza 1 — Pętla sesji 🔵 w toku

Cel fazy: gracz przepisuje tekst, widzi na żywo postęp i dostaje wynik.
Bez tego reszta warstwy gamingowej nie ma czego mierzyć.

| ID    | Ficzer                                                             | Status    |
| ----- | ------------------------------------------------------------------ | --------- |
| F-005 | Stan sesji przepisywania (pozycja w tekście, `Keystroke[]`, timer) | planowane |
| F-006 | Podpowiedź następnego klawisza + podświetlenie pozycji w tekście   | planowane |
| F-007 | HUD na żywo: WPM netto, celność, combo, pasek postępu              | planowane |
| F-008 | Ekran wyniku sesji z rozbiciem metryk                              | planowane |

**Definicja ukończenia fazy:** można przepisać akapit od początku do końca,
metryki na końcu zgadzają się z `computeMetrics`, a `npm run verify` przechodzi.

## Faza 2 — Challenge'e i progresja ⚪ planowane

| ID    | Ficzer                                               | Status    |
| ----- | ---------------------------------------------------- | --------- |
| F-009 | Ekran listy challenge'y z drzewem odblokowań         | planowane |
| F-010 | Podpięcie `LocalProgressRepository` — zapis i odczyt | planowane |
| F-011 | XP, poziomy gracza, progresja między sesjami         | planowane |
| F-012 | Ekran wyniku challenge'a z postępem per cel          | planowane |

## Faza 3 — Warstwa gamingowa ⚪ planowane

| ID    | Ficzer                                                  | Status    |
| ----- | ------------------------------------------------------- | --------- |
| F-013 | Efekty combo — mnożnik, wizualizacja serii              | planowane |
| F-014 | Osiągnięcia i odznaki                                   | planowane |
| F-015 | Tryby: time attack, survival (błąd kończy sesję)        | planowane |
| F-016 | Statystyki per palec i per klawisz, mapa cieplna błędów | planowane |
| F-017 | Ćwiczenia generowane pod najsłabsze klawisze gracza     | planowane |

## Faza 4 — Backend ⚪ planowane

Ruszamy dopiero, gdy fazy 1–3 są zamknięte. Do tego czasu port
`ProgressRepository` z adapterem lokalnym wystarcza.

| ID    | Ficzer                                                  | Status    |
| ----- | ------------------------------------------------------- | --------- |
| F-018 | API postępu (Route Handlers) + `HttpProgressRepository` | planowane |
| F-019 | Konta graczy i uwierzytelnianie                         | planowane |
| F-020 | Globalny ranking                                        | planowane |

## Poza zakresem (świadomie)

- Tryb PvP w czasie rzeczywistym — wymaga osobnego serwera WebSocket, decyzja odłożona.
- Edytor własnych układów klawiatury — model danych to udźwignie, ale to nie jest gra.
- Aplikacja mobilna — trenażer klawiatury fizycznej nie ma sensu na ekranie dotykowym.
