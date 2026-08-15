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

### B-002 · P1 · `next@16.0.8` ma zgłoszoną podatność bezpieczeństwa

npm ostrzega przy każdej instalacji, advisory z 2025-12-11.

**Odtworzenie:** `cd app; npm install` — ostrzeżenie w wyjściu.
**Skutek:** znana podatność w zależności produkcyjnej.
**Naprawa:** podbicie do najnowszej wersji 16.x, potem `npm run verify` i `npm run build`.

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

### B-013 · P2 · Znacznik BOM w `.nvmrc` — ✅ 2026-08-15

PowerShell zapisał plik poleceniem `Set-Content -Encoding utf8`, co dołożyło
znacznik kolejności bajtów (`EF BB BF`) przed `v24.13.0`. Widoczne przez
`od -c .nvmrc` jako `357 273 277 v 2 4 . 1 3 . 0`.

**Skutek:** narzędzia czytające `.nvmrc` jako czysty tekst dostają wersję
`\ufeffv24.13.0`. Czy `actions/setup-node` faktycznie by na tym padł — nie
sprawdziliśmy, CI jeszcze nie ruszyło; poprawione prewencyjnie, bo koszt jest zerowy.
**Naprawa:** plik przepisany bez BOM, z końcem linii. Na Windows do plików
konfiguracyjnych używaj `-Encoding utf8NoBOM` albo `[IO.File]::WriteAllText()`.

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
