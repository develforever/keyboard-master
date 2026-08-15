# ADR 0002 — zustand do stanu klawiszy, rxjs do strumienia zdarzeń

- **Status:** przyjęte
- **Data:** 2026-08-15

## Kontekst

Klawiatura renderuje ponad 100 elementów. Gracz na poziomie 100 WPM generuje około
8 naciśnięć na sekundę, każde z parą `keydown`/`keyup` — czyli ~16 aktualizacji
stanu na sekundę, z których każda dotyczy **jednego** klawisza.

Stan przed zmianą: `useState<string>` w `Keyboard.tsx`, pojedynczy kod klawisza.
Trzy problemy:

1. Każde naciśnięcie przerenderowywało wszystkie 100+ klawiszy.
2. Pojedynczy `string` nie potrafi wyrazić Shift+A — dwóch jednocześnie
   wciśniętych klawiszy. `keyup` dowolnego klawisza kasował cały stan.
3. Przeniesienie tego do `AppContext` pogorszyłoby sprawę — każda zmiana wartości
   kontekstu renderuje wszystkich konsumentów, niezależnie od tego, czego dotyczy.

React Compiler memoizuje komponenty, ale nie pomaga, gdy zmienia się propem
przekazywana wartość — a przy stanie w rodzicu zmienia się przy każdym naciśnięciu.

## Rozważane opcje

**A. `useReducer` + rozbite konteksty.** Zero nowych zależności. Wymaga jednak
kontekstu per klawisz albo ręcznego mechanizmu subskrypcji — czyli napisania
namiastki zustanda. Odrzucone.

**B. Cała domena na strumieniach rxjs (`scan`/`reduce`).** Spójne z tym, co już
w repo jest, i eleganckie dla zdarzeń. Odrzucone jako stan aplikacji: wiązanie
Observable z Reactem wymaga `useSyncExternalStore` i tak, a próg wejścia dla
kolejnych osób w projekcie jest wyraźnie wyższy.

**C. zustand na stan, rxjs na zdarzenia (wybrane).**

## Decyzja

Podział ról:

- **rxjs** obsługuje to, w czym jest dobre — strumień zdarzeń: łączenie
  `keydown`/`keyup`/`blur`/`visibilitychange`, filtrowanie pól formularzy,
  selektywny `preventDefault`, przypięcie znacznika `performance.now()`.
- **zustand** trzyma stan: `Set<KeyCode>` wciśniętych klawiszy.
- Każdy `Key.tsx` subskrybuje **wyłącznie własny boolean** przez
  `useIsKeyPressed(code)`. Selektor zwraca prymityw, więc domyślne porównanie
  `Object.is` w zustandzie odcina render, gdy ten konkretny klawisz się nie zmienił.

Efekt: naciśnięcie jednego klawisza renderuje jeden komponent zamiast stu.

## Konsekwencje

**Pozytywne**

- Koszt renderowania niezależny od liczby klawiszy w układzie.
- `Set` naturalnie obsługuje akordy (Shift+A, Ctrl+Alt+Del).
- Store żyje poza drzewem Reacta, więc silnik gry może go czytać bez hooków.
- Strumień `blur`/`visibilitychange` rozwiązuje klasyczny błąd „klawisz wciśnięty
  na zawsze po Alt+Tab".

**Negatywne**

- Dwie biblioteki do stanu i zdarzeń zamiast jednej — trzeba trzymać się podziału
  ról, inaczej zrobi się z tego bałagan.
- Tworzenie nowego `Set` przy każdej zmianie alokuje pamięć. Przy 16 operacjach
  na sekundę i ~100 elementach to nieistotne; gdyby kiedyś było — jest miejsce
  na strukturę bitową.

**Ważne przy pisaniu kodu:** React Compiler jest włączony (`reactCompiler: true`).
Nie dopisujemy ręcznych `useMemo` / `useCallback` — ta decyzja zakłada, że
memoizacją zajmuje się kompilator.
