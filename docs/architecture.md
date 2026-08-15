# Architektura — Keyboard Master

## Cel

Trenażer pisania bezwzrokowego z warstwą gamingową. Główne wymaganie
niefunkcjonalne: **przy 100+ WPM (≈8 zdarzeń klawiatury na sekundę) UI nie może
gubić klatek**, a pomiar czasu musi być dokładny. To wymaganie determinuje
większość decyzji poniżej.

Drugie wymaganie: warstwa gry ma być gotowa na backend, ale nie ma na niego czekać.
Stąd porty i adaptery — dziś `localStorage`, jutro REST, bez przepisywania domeny.

## Struktura katalogów

```
keyboard-master/
├── CLAUDE.md                     instrukcje dla agenta
├── README.md
├── features.md                   roadmapa faz (ID F-xxx) — źródło prawdy dla zakresu
├── todo.md                       wyłącznie bieżąca faza, rozbita na kroki
├── bugs.md                       defekty z krokami odtworzenia (ID B-xxx)
├── .gitattributes                normalizacja LF
├── .githooks/                    pre-commit (lint-staged), pre-push (verify)
├── .github/workflows/ci.yml      typy + lint + format + testy, potem build
├── .claude/skills/               skille /km-* — wspólne dla Claude CLI i Cowork
├── scripts/make-report.mts       generator raportów sesji
├── reports/                      raporty HTML ze zrzutami (gitignorowane)
├── docs/
│   ├── architecture.md           ten plik
│   ├── NEXT-SESSION.md           stan i prompt na następną sesję
│   └── adr/                      decyzje architektoniczne
└── src/
    ├── domain/                       ← czysty TypeScript, zero frameworka
    │   ├── keyboard/
    │   │   ├── types.ts              KeyDef, KeyboardLayout, SECTION_WIDTH
    │   │   ├── index.ts              listKeys, indexByCode
    │   │   ├── layout.test.ts
    │   │   └── layouts/ansi104.ts    topologia jako dane
    │   ├── engine/
    │   │   ├── types.ts              Keystroke, SessionMetrics, ComboState
    │   │   ├── scoring.ts            WPM, celność, równość rytmu, combo, punkty
    │   │   └── scoring.test.ts
    │   └── challenges/
    │       ├── types.ts              Challenge, ChallengeGoal (suma domknięta)
    │       ├── definitions.ts        startowy zestaw challenge'y
    │       ├── evaluate.ts           ocena celów, drzewo odblokowań
    │       └── evaluate.test.ts
    │
    ├── application/                  ← przypadki użycia i porty
    │   ├── ports/
    │   │   ├── progressRepository.ts ProgressRepository, ProgressSnapshot
    │   │   └── textProvider.ts       TextProvider
    │   ├── input/keyStream.ts        rxjs: keydown/keyup/blur → zdarzenia domenowe
    │   └── stores/useKeyboardStore.ts zustand: Set wciśniętych klawiszy
    │
    ├── infrastructure/               ← adaptery portów
    │   ├── persistence/localProgressRepository.ts
    │   └── text/loremTextProvider.ts
    │
    ├── components/                   ← wyłącznie prezentacja
    │   ├── keyboard/
    │   │   ├── Keyboard.tsx          renderer sterowany danymi
    │   │   ├── Key.tsx               subskrybuje jeden boolean
    │   │   ├── useKeyboardInput.ts   spina strumień ze store'em
    │   │   └── Keyboard.css
    │   ├── ToTranscribe.tsx
    │   └── wrapper.tsx               jedyna granica klient/serwer
    │
    └── app/                          ← trasy Next.js
        ├── layout.tsx                komponent SERWEROWY
        ├── page.tsx
        └── context.tsx
```

## Kierunek zależności

```
        components ──────┐
                         ▼
                   application ────► domain
                         ▲
        infrastructure ──┘  (implementuje application/ports)
```

Domena nie wie o niczym powyżej. Ta reguła jest egzekwowana automatycznie przez
`no-restricted-imports` w `eslint.config.mjs` dla `src/domain/**` — nie jest to
dobra praktyka do zapamiętania, tylko błąd kompilacji CI.

## Przepływ danych podczas sesji

```
KeyboardEvent
   └─► keyStream.ts        filtracja pól formularzy, selektywny preventDefault,
       (rxjs)              znacznik performance.now()
         │
         ├─► useKeyboardStore.press/release   → podświetlenie klawisza (Set<KeyCode>)
         │      └─► Key.tsx (selektor per klawisz — renderuje się JEDEN komponent)
         │
         └─► onKeyEvent → silnik sesji        → Keystroke[]
                                                 │
                                    computeMetrics / computeCombo / computeScore
                                                 │
                                             SessionResult
                                                 │
                                      evaluateChallenge → ChallengeOutcome
                                                 │
                                      ProgressRepository.save (port)
                                                 │
                              LocalProgressRepository → localStorage
                              (docelowo: HttpProgressRepository → API)
```

## Model punktacji

| Metryka       | Definicja                                                           |
| ------------- | ------------------------------------------------------------------- |
| `grossWpm`    | `(wszystkie znaki / 5) / minuty`                                    |
| `netWpm`      | `grossWpm − (niepoprawione błędy / minuty)`, nigdy poniżej 0        |
| `accuracy`    | `poprawne / wszystkie`, 0–1                                         |
| `consistency` | `1 − odchylenie/średnia` odstępów między znakami, 0–1               |
| `combo`       | seria poprawnych znaków; błąd zeruje, modyfikatory nie zrywają      |
| `score`       | `znaki×10 × celność² × (1 + netWpm/200) × mnożnik combo × trudność` |

Kara za celność jest kwadratowa celowo — szybkie pisanie z błędami ma być
punktowane wyraźnie gorzej niż wolne i precyzyjne.

## Model challenge'y

`ChallengeGoal` to domknięta suma typów (`netWpm`, `accuracy`, `combo`,
`consistency`, `noMistakes`, `underTime`). Dodanie nowego rodzaju celu wymusza
uzupełnienie `switch` w `evaluateGoal` — TypeScript nie skompiluje pominięcia.

Challenge zalicza się przy **komplecie** spełnionych celów. XP przyznawane jest
tylko za pierwsze przejście (`alreadyCompleted`). Odblokowania to graf zależności
przez pole `requires`; test pilnuje, że żadne wymaganie nie wskazuje na nieistniejący id.

## Co jest przygotowane pod backend

- `ProgressRepository` — kontrakt persystencji, `ProgressSnapshot` ma
  `schemaVersion` do migracji lub odrzucenia starych danych z przeglądarki.
- `TextProvider` — kontrakt źródła tekstu; adapter zdalny ma timeout, `AbortSignal`
  i lokalny generator ćwiczeń jako alternatywę.
- `SessionResult` jest samowystarczalny — to jednostka, którą wyśle się do API
  i którą zapisze się w tabeli wyników.

Dodanie backendu to: nowy adapter w `infrastructure/`, podmiana instancji
w miejscu montażu. Domena i komponenty zostają bez zmian.

## Znane ograniczenia

- Klawisze `NumpadAdd` i `NumpadEnter` są fizycznie wysokie na 2u; renderer oparty
  na rzędach flex tego nie odwzorowuje. Naprawa wymaga renderera na CSS Grid.
- Jedyny układ to ANSI 104 (US). ISO/PL wymaga dodatkowego klawisza
  `IntlBackslash` i innego kształtu Entera — to nowy plik danych.
- `AppContext` (`lang`, `isReady`) pochodzi ze startowego szkieletu i czeka na
  rewizję przy wprowadzaniu ustawień gracza.
