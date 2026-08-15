# ADR 0004 — Polityka wersji Node

- **Status:** przyjęte
- **Data:** 2026-08-15
- **Kontekst decyzji:** zamknięcie B-003 przed startem fazy 1

## Kontekst

`.nvmrc` deklarowało `v25.0.0`, a na maszynie deweloperskiej stał Node 22.22.3.
CI czyta `.nvmrc` przez `node-version-file`, więc pipeline budował na innej
wersji niż ta, na której powstawał kod — klasyczne źródło „u mnie działa".

Przy weryfikacji wyszła rzecz poważniejsza od samego rozjazdu: **Node 25 był już
po końcu życia**. Aktywne wsparcie zakończyło się 1 kwietnia 2026, a wsparcie
bezpieczeństwa 1 czerwca 2026 — dwa i pół miesiąca przed tą decyzją. Repozytorium
byłoby więc przypięte do runtime'u bez łatek bezpieczeństwa, i to w tym samym
czasie, w którym podbijamy Next.js właśnie z powodu podatności (B-002).

Node 25 należał do wydań nieparzystych, które z założenia nigdy nie wchodzą w LTS.

## Rozważane opcje

**A. Node 22.** Był już zainstalowany, więc zero pracy. Odrzucone: wsparcie
bezpieczeństwa kończy się 30 kwietnia 2027, czyli w horyzoncie tego projektu.

**B. Node 26.** Wydany 5 maja 2026, obecnie Current. Wejdzie w LTS pod koniec
października 2026. Odrzucone: na repozytorium, które ma zacząć produkować kod,
faza pre-LTS to niepotrzebne ryzyko. Wrócimy do tego po jego promocji.

**C. Node 24 (wybrane).** Active LTS, wsparcie bezpieczeństwa do 30 kwietnia 2028.

## Decyzja

Projekt stoi na **Node 24.13.0**, zapisanym w `.nvmrc` jako `v24.13.0`.

Zasady na przyszłość:

1. **Wyłącznie wersje parzyste.** Nieparzyste nigdy nie wchodzą w LTS i wypadają
   z obsługi w ciągu ośmiu miesięcy.
2. **`.nvmrc` jest jedynym źródłem prawdy.** CI czyta je przez `node-version-file`,
   deweloper przez `nvm use`. Zmiana wersji to zmiana tego pliku, nigdy sama
   konfiguracja pipeline'u.
3. **Wersja pinowana dokładnie** (`v24.13.0`, nie `24`). Przy `nvm` i CI dokładny
   pin usuwa całą klasę różnic między maszynami.
4. **Dolna granica to Node 22.18** — od niej działa usuwanie typów bez flagi,
   z czego korzysta `scripts/make-report.mts`. Zejście niżej wymaga kroku
   budowania dla skryptów.
5. **Przegląd przy każdej promocji LTS** (październik). Migracja gdy do końca
   wsparcia bezpieczeństwa zostaje mniej niż rok.
6. **`.nvmrc` bez znacznika BOM**, zakończone znakiem nowej linii. Na Windows
   zapisuj przez `-Encoding utf8NoBOM` — domyślne `utf8` potrafi dołożyć BOM,
   co psuje parsowanie wersji (B-013).

## Konsekwencje

**Pozytywne**

- Runtime z łatkami bezpieczeństwa do kwietnia 2028 — dłużej niż realistyczny
  horyzont fazy 4.
- CI i maszyna deweloperska budują na tej samej wersji.
- Reguła „tylko parzyste" zdejmuje tę decyzję z głowy przy kolejnych wydaniach.

**Negatywne**

- Dokładny pin oznacza ręczne podbijanie łatek 24.x. Świadomy koszt —
  przewidywalność jest tu warta więcej niż automatyczne aktualizacje.
- Przy podbiciu majora trzeba przelecieć pełny `npm run build`, bo Turbopack
  i React Compiler bywają wrażliwe na zmianę wersji Node.
