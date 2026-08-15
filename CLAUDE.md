# Keyboard Master — instrukcje dla agenta

Trenażer pisania bezwzrokowego z warstwą gamingową: challenge'e, combo, XP, punktacja.

## Zanim zaczniesz cokolwiek robić

Przeczytaj w tej kolejności: `docs/NEXT-SESSION.md` (stan i zadanie), `todo.md`
(bieżąca faza), `bugs.md` (znane defekty). Dopiero potem sięgaj do kodu.

## Stan projektu

Warstwa domenowa — silnik punktacji, model klawiatury, challenge'e — jest gotowa
i pokryta testami. Klawiatura reaguje na fizyczne klawisze. **Nie ma jeszcze pętli
gry**: nie da się przepisać tekstu ani zobaczyć wyniku. To jest zakres fazy 1.

Backendu nie ma i na razie nie będzie. Persystencja idzie przez port
`ProgressRepository` z adapterem `localStorage`.

## Stos

- Next.js 16 (App Router, Turbopack) + React 19.2 z **React Compiler**
- TypeScript 5 `strict`, Tailwind CSS 4 (konfiguracja w CSS, brak `tailwind.config`)
- rxjs 7 — strumienie zdarzeń klawiatury; zustand 5 — stan
- Vitest 4 — testy; Storybook 10 — komponenty
- Node z `.nvmrc`; generator raportów wymaga Node ≥ 22.18

Kod aplikacji jest w `src/` w katalogu głównym repo. Podkatalog `app/` już nie
istnieje — komendy npm uruchamiasz z roota.

## Komendy

```bash
npm ci              # instalacja (ustawia core.hooksPath na .githooks)
npm run dev         # serwer deweloperski
npm run verify      # typecheck + lint + testy — to samo, co CI i hook pre-push
npm run format      # prettier --write .
npm test            # vitest run
npm run storybook   # Storybook na :6006
npm run report -- --feature F-005 --title "Opis"   # raport sesji do reports/
```

## Podział pracy

Projekt prowadzony jest w dwóch narzędziach i to nie jest przypadek:

- **Cowork (sesja w chmurze)** — dyskusja, architektura, ADR-y, planowanie faz,
  aktualizacja `features.md` / `todo.md` / `bugs.md`, raporty, weryfikacja
  wizualna przez Claude in Chrome.
- **Claude CLI (na maszynie użytkownika)** — pisanie i iterowanie kodu, testy,
  build, git. Ma bezpośredni dostęp do dysku i `localhost`, więc pętla
  napisz–uruchom–popraw jest tam znacznie szybsza.

Interfejsem między nimi są **pliki w repo**: ten dokument, `docs/NEXT-SESSION.md`
i pliki śledzące. Jeśli decyzja nie trafiła do pliku, nie istnieje — druga strona
jej nie zobaczy.

Skille `/km-verify`, `/km-ui-check`, `/km-report`, `/km-session-end` leżą
w `.claude/skills/` w repo, więc działają w obu narzędziach i są wersjonowane
razem z kodem.

## Planowanie i śledzenie

| Plik                   | Rola                                                 |
| ---------------------- | ---------------------------------------------------- |
| `features.md`          | roadmapa faz, źródło prawdy dla zakresu (ID `F-xxx`) |
| `todo.md`              | **wyłącznie bieżąca faza**, rozbita na kroki         |
| `bugs.md`              | defekty z krokami odtworzenia (ID `B-xxx`)           |
| `docs/NEXT-SESSION.md` | stan i gotowy prompt na następną sesję               |
| `reports/`             | raporty HTML — gitignorowane, regenerowalne          |

**Zadanie istnieje w dokładnie jednym z tych plików.** Duplikat oznacza, że za
dwie sesje statusy się rozjadą.

Wpis bez kroków odtworzenia nie jest bugiem, tylko pomysłem — jego miejsce jest
w `features.md`.

## Praca fazami

Faza to zamknięty zakres z własnym kryterium ukończenia opisanym w `features.md`.
Nie zaczynamy fazy N+1 przed zamknięciem N.

**Bramka zamknięcia fazy** — wszystkie punkty naraz:

1. `npm run verify` przechodzi
2. kryterium ukończenia z `features.md` jest spełnione i sprawdzone w przeglądarce
3. `README.md` i `docs/architecture.md` opisują aktualny stan
4. decyzje architektoniczne mają wpis w `docs/adr/`
5. `todo.md` przepisany na kroki następnej fazy
6. raport wygenerowany, `docs/NEXT-SESSION.md` nadpisany

## Git

Użytkownik pracuje na **Windows z PowerShell 7** i sam wykonuje polecenia.
Nie uruchamiaj gita za niego — przygotuj gotową listę do skopiowania.

- **Nigdy na `main`.** Najpierw `git rev-parse --abbrev-ref HEAD`; jeśli to `main`,
  pierwszym poleceniem jest założenie gałęzi.
- Gałęzie: `feat/F-005-opis`, `fix/B-002-opis`, `chore/opis`.
- Conventional Commits z ID w treści:
  `feat(engine): F-005 reduktor stanu sesji przepisywania`. Dzięki temu raport
  i changelog powstają z `git log`, a nie z pamięci.
- W PowerShell łącz polecenia `;`. Treści commitów z apostrofem lub `$` ujmuj
  w cudzysłów pojedynczy.

## Architektura — kierunek zależności

```
components  →  application  →  domain
                    ↑
            infrastructure   (implementuje porty z application/ports)
```

Strzałki nigdy nie idą w drugą stronę.

- `src/domain/**` — czysty TypeScript. Zero importów z `react`, `next`, `zustand`,
  `rxjs`, `@/components`, `@/infrastructure`. Pilnuje tego `no-restricted-imports`
  w `eslint.config.mjs` — jeśli lint tu krzyczy, to projekt jest zły, nie lint.
- `src/application/ports/**` — interfejsy. Warstwa aplikacji nie zna adapterów.
- `src/infrastructure/**` — adaptery. Wymiana `localStorage` na REST to nowy plik
  tutaj, zero zmian w domenie. To jest cel tej struktury.
- `src/components/**` — prezentacja i wiązanie hooków. Żadnych obliczeń WPM,
  punktów ani warunków zaliczenia challenge'a w JSX.

Uzasadnienia: `docs/adr/`. Przegląd: `docs/architecture.md`.

## Konwencje kodu

**React Compiler jest włączony** (`reactCompiler: true`). Nie pisz ręcznych
`useMemo` ani `useCallback` — kompilator memoizuje sam. Wyjątek: gdy zewnętrzna
biblioteka wymaga stabilnej referencji i jest to udokumentowane komentarzem.

- Typowanie pełne. `any` jest błędem lintera. Dane z zewnątrz (`localStorage`,
  `fetch`) są `unknown` i przechodzą przez funkcję walidującą.
- Sumy typów zamykaj `switch`em z `const _: never = value` w `default` — dodanie
  wariantu ma wywalić kompilację, nie przejść po cichu.
- Każdy `fetch` ma `AbortSignal`, sprawdzenie `response.ok` i własny typ błędu.
- Nazwy: komponenty `PascalCase.tsx`, reszta `camelCase.ts`.
- Importy absolutne przez `@/` (alias na `src/`), nie `../../..`.
- Komentarze po polsku, tłumaczą **dlaczego**, nie **co**.

## Zasady specyficzne dla klawiatury

- Identyfikacja **zawsze przez `KeyboardEvent.code`**, nigdy `key`. `code` jest
  niezależne od układu językowego. `key` służy wyłącznie do porównania wpisanego
  znaku z oczekiwanym.
- **Nie blokuj `preventDefault()` globalnie.** Lista jest w `SWALLOWED_CODES`
  (`keyStream.ts`) i celowo nie zawiera F1–F12, Escape ani kombinacji
  z Ctrl/Meta/Alt. Zablokowanie F5 czy Ctrl+W było realnym błędem w tym repo.
- **Nie używaj `stopPropagation()`** na `window`.
- Klawisze przytrzymane w chwili `blur` / Alt+Tab muszą być zwolnione.
- Stan wciśnięcia to `Set<KeyCode>` — Shift+A to dwa klawisze naraz.
- Klawiatura ma 100+ elementów przy 8 uderzeniach na sekundę. Każdy klawisz
  subskrybuje **własny boolean** przez `useIsKeyPressed`. Nie przenoś tego stanu
  do Contextu.

## Układ klawiatury to dane, nie JSX

`src/domain/keyboard/layouts/ansi104.ts` opisuje topologię, `Keyboard.tsx` ją
renderuje. Nowy układ = nowy plik danych. Szerokości w `1u` sumują się do stałych
z `SECTION_WIDTH`; `layout.test.ts` to weryfikuje.

## Definition of Done pojedynczej zmiany

1. `npm run verify` przechodzi
2. nowa logika domenowa ma testy, w tym przypadki brzegowe (zero znaków, zerowy
   czas, same błędy, wartości progowe)
3. nowe I/O ma obsługę błędów i anulowanie
4. zmiana architektoniczna ma wpis w `docs/adr/`
5. statusy w `features.md` / `todo.md` / `bugs.md` zaktualizowane
6. diff nie zawiera zmian samych końców linii

## Pułapki tego repo

- **Końce linii.** Repo trzyma LF, Windows zapisuje CRLF. `.gitattributes` wymusza
  `eol=lf`. Jeśli `git status` pokazuje wszystkie pliki jako zmienione:
  `git add --renormalize .` i osobny commit.
- **`next@16.0.8` ma zgłoszoną podatność** (B-002) — do podbicia w obrębie 16.x.
- **`.nvmrc` deklaruje v25, lokalnie jest Node 22** (B-003) — CI buduje na innej
  wersji niż maszyna deweloperska.
- **Fonty Google** (`next/font/google`) wymagają sieci przy buildzie. Build bez
  dostępu do `fonts.googleapis.com` padnie — to nie jest błąd kodu.
- **Sesja Cowork nie dosięga `localhost`.** Weryfikacja wizualna wyłącznie przez
  Claude in Chrome w przeglądarce użytkownika.
