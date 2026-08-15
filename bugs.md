# Bugs

Defekty i dług techniczny. Każdy wpis ma ID `B-xxx`, kroki odtworzenia i skutek.
Wpis bez kroków odtworzenia nie jest bugiem, tylko pomysłem — jego miejsce
jest w `features.md`.

Priorytety: `P1` blokuje pracę lub psuje działanie · `P2` widoczne dla gracza ·
`P3` dług techniczny bez wpływu na działanie.

---

## Otwarte

### B-001 · P3 · Klawisze numpada nie mają wysokości 2u

`NumpadAdd` i `NumpadEnter` są fizycznie wysokie na dwa rzędy. Renderer oparty na
rzędach flex tego nie odwzorowuje — klawisze zajmują jedno pole, a pod nimi jest
wypełniacz.

**Odtworzenie:** otwórz aplikację, porównaj blok numeryczny z fizyczną klawiaturą.
**Skutek:** kosmetyczny, nie wpływa na rozgrywkę.
**Naprawa:** renderer bloku `numpad` na CSS Grid z `grid-row: span 2`.
Kontekst: `docs/adr/0003`.

### B-014 · P3 · `image-size` z podatnością DoS w zależnościach deweloperskich

`npm audit` zgłasza trzy podatności high w `image-size` (GHSA-w3rx-r6r6-pgpr,
GHSA-5p2g-fcmc-qvqq — nieskończone pętle w parserach ICNS, JXL i HEIF).
Łańcuch: `@storybook/nextjs-vite` → `vite-plugin-storybook-nextjs` → `image-size`.
**Poprawki nie ma** („No fix available") — czekamy na wydanie u dostawcy.

**Odtworzenie:** `npm audit` w katalogu głównym — trzy wpisy high.
Kontrola zakresu: `npm audit --omit=dev` daje `found 0 vulnerabilities`.
**Skutek:** żaden dla wdrożenia. `image-size` nie wchodzi do bundla
produkcyjnego, jest wyłącznie w łańcuchu Storybooka. Wektor to spreparowany
plik graficzny przetwarzany lokalnie przy buildzie Storybooka.
**Naprawa:** poczekać na `vite-plugin-storybook-nextjs` bez podatnej zależności;
Dependabot (patrz `todo.md`) wychwyci wydanie. Nie ma powodu do obchodzenia
problemu przez `overrides` przy tym poziomie ryzyka.

### B-004 · P3 · Katalog `_to_delete/` do usunięcia

Pozostałości scaffoldingu Storybooka (`src/stories`), boilerplate `app/README.md`
i archiwa transportowe z sesji Cowork.
Przeniesione tam, bo most do dysku nie pozwala na kasowanie plików.

**Naprawa:** `Remove-Item -Recurse -Force _to_delete`.

### B-005 · P3 · `AppContext` ze scaffoldingu wymaga rewizji

`lang` nie jest nigdzie przełączany, a `isReady` dubluje stan ładowania, który
`ToTranscribe` trzyma już lokalnie. Dwa źródła prawdy o tym samym.

**Skutek:** przy dodawaniu ustawień gracza łatwo rozjechać stany.
**Naprawa:** zaplanowana w fazie 1 (patrz `todo.md`).

### B-012 · P3 · Klawiatura nie jest wyśrodkowana w pionie

W `src/app/page.tsx` kontener ma `justify-center`, ale dziecko z `flex-1`
pochłania całą wolną przestrzeń — `justify-content` nie ma czego rozdzielać.
Klawiatura renderuje się w naturalnej wysokości przy górnej krawędzi tego dziecka.

**Odtworzenie:** otwórz `localhost:3000` w oknie o wysokości ~730 px.
Klawiatura przykleja się do góry, pod nią zostaje pusty obszar,
a licznik znaków ląduje przy dolnej krawędzi.
**Skutek:** kosmetyczny; przy niskich oknach layout wygląda na niedokończony.
**Naprawa:** usunąć `flex-1` z kontenera klawiatury albo dodać mu
`flex items-center`. Do zrobienia przy F-007, gdy powstanie HUD i tak
przebuduje układ ekranu.

---

## Naprawione

### B-002 · P1 · `next@16.0.8` ma zgłoszoną podatność bezpieczeństwa — ✅ 2026-08-15

npm ostrzegał przy każdej instalacji, advisory z 2025-12-11. Po upublicznieniu
repo graf zależności — a z nim podatna wersja — był widoczny dla wszystkich.

Podbite do **`next@16.3.1`** i **`eslint-config-next@16.3.1`** (najnowsze 16.x;
świadomie zostajemy w 16.x, przejście na 17 to osobna decyzja). Obie wersje
przypięte dokładnie, bez `^`.

**Weryfikacja:** `npm run verify` zielone (typecheck, lint, 35/35 testów),
`npm run build` zielony na Turbopacku. React Compiler nadal aktywny — chunk
produkcyjny z komponentami klawiatury zawiera alokacje cache'u memoizacji
z `react/compiler-runtime` (`(0, o.c)(19)` w komponencie klawisza), więc
transformacja faktycznie zachodzi, a nie tylko `reactCompiler: true` stoi
w konfiguracji. `npm audit --omit=dev` — `found 0 vulnerabilities`.

Pozostałe znaleziska audytu dotyczą wyłącznie zależności deweloperskich
i mają własny wpis: B-014.

### B-013 · P3 · Znacznik BOM w `.nvmrc` w kopii roboczej — ✅ 2026-08-15

PowerShell zapisał plik poleceniem `Set-Content -Encoding utf8`, co dołożyło
znacznik kolejności bajtów (`EF BB BF`) przed `v24.13.0`. Widoczne przez
`od -c .nvmrc` jako `357 273 277 v 2 4 . 1 3 . 0`.

**Zasięg: wyłącznie kopia robocza.** BOM nigdy nie trafił do commita — żadna
wersja `.nvmrc` w historii go nie zawiera (sprawdzone przez `git show <rev>:.nvmrc`
dla wszystkich rewizji dotykających pliku). Ani repo, ani CI nigdy nie widziały
zepsutej zawartości; pierwotny opis sugerujący defekt w repo był błędny.

**Skutek:** żaden poza lokalnym — narzędzia czytające `.nvmrc` jako czysty tekst
dostałyby na tej maszynie wersję z prefiksem BOM zamiast czystego `v24.13.0`.
CI nigdy nie był zagrożony, bo `actions/setup-node` czyta plik z commita.
**Naprawa:** plik przepisany bez BOM, z końcem linii. Wpis zostaje jako zapis
pułapki narzędziowej, nie defektu repo: na Windows do plików konfiguracyjnych
używaj `-Encoding utf8NoBOM` albo `[IO.File]::WriteAllText()`.

### B-003 · P2 · `.nvmrc` niezgodne z zainstalowanym Node — ✅ 2026-08-15

`.nvmrc` deklarowało `v25.0.0`, lokalnie był Node 22 — CI budowało na innej
wersji niż maszyna deweloperska. Przy okazji wyszło, że **Node 25 był już po
końcu życia**: aktywne wsparcie skończyło się 1 kwietnia 2026, a wsparcie
bezpieczeństwa 1 czerwca 2026.

Wyrównane do **Node 24.13.0** (Active LTS, wsparcie bezpieczeństwa do
30 kwietnia 2028). Uzasadnienie wyboru: `docs/adr/0004`.

### B-006 · P1 · `preventDefault()` blokował F5, F12 i skróty z Ctrl — ✅ 2026-08-15

`Keyboard.tsx` wołał `preventDefault()` i `stopPropagation()` na każdym `keydown`.
Naprawione listą `SWALLOWED_CODES` w `keyStream.ts` i pominięciem zdarzeń
z wciśniętym Ctrl/Meta/Alt.

### B-007 · P1 · Wszystkie pliki widoczne jako zmienione (CRLF) — ✅ 2026-08-15

Repo trzymało LF, Windows zapisywał CRLF — `git status` pokazywał 26 plików
i ponad 10 000 zmienionych linii. Naprawione przez `.gitattributes` z `eol=lf`.

### B-008 · P2 · Zduplikowane kody klawiszy — ✅ 2026-08-15

`Enter` występował w rzędzie głównym i na numpadzie (powinno być `NumpadEnter`),
`Backslash` dwa razy. Naciśnięcie podświetlało oba. Naprawione przez przeniesienie
układu do danych i test wykrywający duplikaty.

### B-009 · P2 · Klawisze zacinały się po Alt+Tab — ✅ 2026-08-15

Brak obsługi `blur` — klawisz wciśnięty w chwili przełączenia okna zostawał
podświetlony na zawsze. Naprawione przez `createBlurStream` → `releaseAll`.

### B-010 · P1 · Root layout w całości po stronie klienta — ✅ 2026-08-15

`wrapper.tsx` renderował `<html>` jako komponent kliencki, przez co cała
aplikacja lądowała w bundlu klienta. Naprawione — `layout.tsx` jest serwerowy.

### B-011 · P2 · Storybook nie wstawał — ✅ 2026-08-15

`.storybook/main.ts` wskazywał trzy addony nieobecne w `package.json`
(w Storybooku 10 essentials są w rdzeniu). Naprawione — pusta lista `addons`.
