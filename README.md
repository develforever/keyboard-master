# Keyboard Master

[![CI](https://github.com/develforever/keyboard-master/actions/workflows/ci.yml/badge.svg)](https://github.com/develforever/keyboard-master/actions/workflows/ci.yml)

Trenażer pisania bezwzrokowego z warstwą gamingową: challenge'e, combo, XP i punktacja.

> **Stan:** wczesna faza. Warstwa domenowa — silnik punktacji, model klawiatury
> i challenge'e — jest gotowa i pokryta testami. Klawiatura reaguje na fizyczne
> klawisze. Pętli gry jeszcze nie ma: nie da się przepisać tekstu ani zobaczyć
> wyniku. Zakres i postęp: [`features.md`](features.md).

## Wymagania

- Node w wersji z `.nvmrc` (`nvm use`); generator raportów wymaga Node ≥ 22.18
- npm

## Start

```bash
npm ci
npm run dev
```

Aplikacja: http://localhost:3000

## Komendy

| Komenda              | Opis                                 |
| -------------------- | ------------------------------------ |
| `npm run dev`        | serwer deweloperski                  |
| `npm run build`      | build produkcyjny                    |
| `npm run verify`     | typy + lint + testy (to samo, co CI) |
| `npm test`           | testy jednostkowe                    |
| `npm run test:watch` | testy w trybie ciągłym               |
| `npm run format`     | formatowanie Prettierem              |
| `npm run storybook`  | Storybook na porcie 6006             |
| `npm run report`     | raport sesji do `reports/`           |

## Struktura

```
src/domain/          czysty TypeScript — silnik punktacji, model klawiatury, challenge'e
src/application/     porty i przypadki użycia; strumień klawiatury, store'y
src/infrastructure/  adaptery portów — localStorage, HTTP
src/components/      prezentacja
src/app/             trasy Next.js
scripts/             narzędzia deweloperskie
```

Kierunek zależności: `components → application → domain`, `infrastructure`
implementuje porty. Reguła egzekwowana przez ESLint.

## Planowanie i śledzenie

| Plik                   | Rola                                                    |
| ---------------------- | ------------------------------------------------------- |
| `features.md`          | roadmapa faz, źródło prawdy dla zakresu (ID `F-xxx`)    |
| `todo.md`              | wyłącznie bieżąca faza, rozbita na kroki                |
| `bugs.md`              | defekty z krokami odtworzenia (ID `B-xxx`)              |
| `docs/NEXT-SESSION.md` | stan i gotowy prompt na następną sesję                  |
| `reports/`             | raporty HTML ze zrzutami — gitignorowane, regenerowalne |

Zadanie istnieje w dokładnie jednym z tych plików.

## Dokumentacja

- [`CLAUDE.md`](CLAUDE.md) — konwencje kodu i zasady pracy w repo
- [`docs/architecture.md`](docs/architecture.md) — struktura i przepływ danych
- [`docs/adr/`](docs/adr/) — decyzje architektoniczne wraz z uzasadnieniem

## Hooki gita

`npm ci` ustawia `core.hooksPath` na `.githooks`:

- `pre-commit` — Prettier i ESLint na plikach z commita
- `pre-push` — pełne `npm run verify`

Pominięcie: `git commit --no-verify` / `git push --no-verify`.

## Licencja

[AGPL-3.0-only](LICENSE).

Możesz używać, modyfikować i rozpowszechniać ten kod. Jeśli udostępniasz
zmodyfikowaną wersję użytkownikom przez sieć — również jako serwis — musisz
udostępnić im kod źródłowy swojej wersji (§13). Uzasadnienie wyboru:
[`docs/adr/0005`](docs/adr/0005-licencja-agpl.md).
