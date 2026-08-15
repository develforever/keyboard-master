# ADR 0005 — Licencja AGPL-3.0

- **Status:** przyjęte
- **Data:** 2026-08-15
- **Kontekst decyzji:** upublicznienie repozytorium

## Kontekst

Repozytorium zostało upublicznione 15 sierpnia 2026 bez pliku `LICENSE`.
W takim stanie obowiązuje domyślnie „wszelkie prawa zastrzeżone" — kod jest
widoczny, ale nikt nie może go legalnie użyć, sforkować ani wykorzystać
fragmentu. Publiczne repo bez licencji daje więc najgorszą kombinację:
pełną widoczność bez żadnej użyteczności dla innych.

Zależności nie ograniczały wyboru. `next`, `react`, `react-dom`, `zustand`,
`clsx` i `tailwindcss` są na MIT, `rxjs` i `typescript` na Apache-2.0.
Kilka pakietów narzędziowych ma MPL-2.0 (`lightningcss`, `axe-core`) — to
copyleft na poziomie pliku, dotyczy ich własnego kodu i nie przenosi się
na nasz. Wszystkie te licencje są jednokierunkowo zgodne z AGPL-3.0.

## Rozważane opcje

**A. MIT.** Standard dla projektów portfolio, maksymalna adopcja, dwadzieścia
linii tekstu. Odrzucone: pozwala wziąć kod, zmienić i uruchomić jako zamknięty
serwis bez oddawania czegokolwiek.

**B. Apache-2.0.** MIT plus jawny grant patentowy i ochrona znaku towarowego.
Odrzucone z tego samego powodu co MIT — nie zamyka scenariusza zamkniętego forka.

**C. GPL-3.0.** Copyleft, ale wyzwalany dystrybucją. Uruchomienie zmodyfikowanej
wersji jako serwisu sieciowego **nie jest** dystrybucją, więc dla aplikacji
webowej GPL jest praktycznie tak permisywne jak MIT. Odrzucone jako pozorne
zabezpieczenie.

**D. AGPL-3.0 (wybrane).**

## Decyzja

Projekt jest na **AGPL-3.0-only** (identyfikator SPDX: `AGPL-3.0-only`).

Rozstrzygający był §13: kto udostępnia zmodyfikowaną wersję użytkownikom przez
sieć, musi udostępnić im również kod źródłowy swojej wersji. To jedyny copyleft,
który dla aplikacji webowej działa zgodnie z intencją.

## Konsekwencje

**Obowiązek techniczny — §13.** Wdrożona aplikacja musi dawać użytkownikom
dostęp do źródeł swojej wersji. W praktyce: widoczny odnośnik do repozytorium
w interfejsie, najlepiej w stopce, wskazujący konkretną wersję. **Musi trafić do
aplikacji przed pierwszym publicznym wdrożeniem** — dopóki projekt działa
wyłącznie lokalnie, obowiązek się nie aktywuje. Zadanie jest w `todo.md`.

**Pozytywne**

- Zamknięty fork uruchomiony jako konkurencyjny serwis jest niezgodny z licencją.
- Kod pozostaje legalnie użyteczny do nauki, forkowania i wkładu.

**Negatywne**

- Firmy w praktyce omijają AGPL — wiele działów prawnych ma ją na liście
  zakazanych. Jeśli projekt miałby kiedyś trafić do zastosowań komercyjnych,
  wymaga to zmiany licencji, a ta wymaga zgody wszystkich kontrybutorów.
  Dopóki jesteśmy jedynym autorem, zmiana jest tania — potem przestaje być.
- Część potencjalnych kontrybutorów odpada z tego samego powodu.

**Do rewizji, gdy** pojawi się pierwszy zewnętrzny kontrybutor. To ostatni
moment, w którym zmiana licencji jest jeszcze decyzją jednej osoby.
