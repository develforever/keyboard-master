---
name: km-ui-check
description: Wizualna i behawioralna weryfikacja keyboard-master w przeglądarce przez Claude in Chrome — asercje na DOM, test akordów, preventDefault i zacinania klawiszy. Użyj po zmianach w UI, w komponentach klawiatury albo gdy użytkownik uruchomił dev server.
---

# Weryfikacja UI w przeglądarce — keyboard-master

Testy jednostkowe nie wykryją źle rozłożonych klawiszy ani klawisza, który zaciął
się po Alt+Tab. To robi ten przebieg.

## Warunek wstępny

Użytkownik musi mieć uruchomiony `npm run dev`. Jeśli nie masz pewności — zapytaj.
Nie uruchamiaj dev servera sam: w sesji chmurowej i tak nie dosięgniesz `localhost`.

## Zasada nadrzędna: asercje, nie oglądanie

Zrzut ekranu mówi „wygląda dobrze". Odpytanie DOM mówi „104 klawisze, zero
duplikatów, spacja ma 6,15u". Domyślnie sprawdzaj przez `javascript_tool`,
a zrzuty rób tylko wtedy, gdy wynik ma trafić do raportu albo gdy naprawdę
oceniasz estetykę.

**Pułapka, która kosztowała 45 sekund timeoutu:** karta sterowana zdalnie jest
w tle, więc `requestAnimationFrame` w niej **nie odpala** i każde `await` na
nim zawiesza wywołanie. Używaj `await new Promise(r => setTimeout(r, 50))`.
Po `navigate` odczekaj też na hydratację — bezpośrednio po przeładowaniu
aplikacja jeszcze nie nasłuchuje i asercje wyjdą puste. Sprawdź
`document.readyState === 'complete'` i ponów.

## Kolejność

1. `tabs_context_mcp` — nie używaj ponownie ID kart z poprzedniej sesji.
2. `resize_window` do 1280×900, potem nowa karta na `http://localhost:3000`.
3. `read_console_messages` trzeba wywołać **przed** interesującym nas ładowaniem —
   zbieranie logów startuje dopiero od pierwszego wywołania. Przeładuj stronę
   i odczytaj ponownie.
4. Asercje strukturalne, potem behawioralne, na końcu zrzut.

## Asercje strukturalne

Przez `javascript_tool` na `.keyboard__key`:

- liczba realnych klawiszy (`dataset.code`) — dla ANSI 104 musi być **104**
- brak duplikatów kodów; `Enter` i `NumpadEnter` obecne osobno
- klawisze home row — dokładnie 8: `KeyA` … `Semicolon`
- proporcje: `offsetWidth` klawisza względem `KeyA`. Wartości będą minimalnie
  niższe od nominalnych (spacja ~6,15 zamiast 6,25) — to szerokość przerw,
  nie błąd
- żaden realny klawisz nie ma pustej etykiety

## Asercje behawioralne

Syntetyczne `KeyboardEvent` przez `window.dispatchEvent` działają — aplikacja nie
sprawdza `isTrusted`. Wzorzec:

```js
const fire = (type, init) => {
  const e = new KeyboardEvent(type, { bubbles: true, cancelable: true, ...init });
  window.dispatchEvent(e);
  return e.defaultPrevented;
};
const active = () =>
  [...document.querySelectorAll('.keyboard__key--active')].map((k) => k.dataset.code);
```

Sprawdź:

- pojedynczy klawisz podświetla dokładnie jeden element, `keyup` czyści
- **akordy**: Shift+A daje dwa aktywne, zwolnienie litery zostawia Shift;
  Ctrl+Alt+Del daje trzy
- **`defaultPrevented` musi być `false`** dla: F5, F12, Escape, Ctrl+R, Ctrl+W,
  Ctrl+Space i zwykłych liter
- **`defaultPrevented` musi być `true`** dla: spacji, Tab, strzałek, Backspace
  bez modyfikatorów
- **zacinanie**: dwa wciśnięte klawisze, `window.dispatchEvent(new Event('blur'))`,
  stan musi być pusty
- auto-powtarzanie (`repeat: true`) nie duplikuje stanu

## Konsola

Zero błędów. Ostrzeżenia o hydratacji traktuj jak błąd — root layout jest
komponentem serwerowym i nie powinien ich generować.

## Zrzuty

Maksymalnie **3 na ficzer**. Każdy kosztuje realny kontekst.

Żeby uchwycić wciśnięte klawisze, wyślij same `keydown` bez `keyup`, odczekaj
~250 ms i dopiero rób zrzut. Zapisuj z `save_to_disk`, a potem przenieś do
`reports/.shots/` w konwencji `NN-nazwa.png` z podpisem w `NN-nazwa.txt`.

Na koniec zwolnij klawisze (`blur`) i zamknij utworzoną kartę.

## Czego nie robić

- Nie klikaj elementów mogących wywołać `alert` / `confirm` — modal blokuje
  wszystkie kolejne polecenia rozszerzenia.
- Po dwóch–trzech nieudanych próbach tej samej akcji zatrzymaj się i zapytaj.

## Wynik

Defekty dopisz do `bugs.md` z krokami odtworzenia i priorytetem. To, co przeszło,
zapisz w `todo.md` jako odhaczoną listę — inaczej następna sesja sprawdzi to
drugi raz.
