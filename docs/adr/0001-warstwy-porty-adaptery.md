# ADR 0001 — Warstwowa architektura z portami i adapterami

- **Status:** przyjęte
- **Data:** 2026-08-15
- **Kontekst decyzji:** start prac nad warstwą gamingową (challenge'e, punktacja, progresja)

## Kontekst

Aplikacja startuje bez backendu, ale docelowo ma mieć konta graczy, globalny ranking
i historię sesji. Decyzja o backendzie jest odroczona, nie odwołana.

Kod przed zmianą trzymał całą logikę w komponentach: `Keyboard.tsx` mieszał topologię
klawiatury, obsługę zdarzeń i style; `ToTranscribe.tsx` wołał zewnętrzne API
bezpośrednio z `useEffect`. Przy takim układzie dodanie backendu oznacza przepisanie
komponentów, a logiki punktacji nie da się przetestować bez renderowania Reacta.

## Rozważane opcje

**A. Płaska struktura (`components/` + `lib/`).** Najmniej ceremonii. Odrzucone:
nic nie powstrzymuje `lib/` przed zaimportowaniem komponentu, a granica istnieje
tylko w głowie autora.

**B. Pełny DDD z agregatami i repozytoriami per encja.** Odrzucone jako przerost
formy — to gra przeglądarkowa, nie system transakcyjny.

**C. Trzy warstwy z portami (wybrane).** `domain` / `application` / `infrastructure`,
plus `components` jako prezentacja. Warstwa aplikacji zna wyłącznie interfejsy.

## Decyzja

Przyjmujemy wariant C.

- `src/domain/**` — czysty TypeScript, zero zależności od Reacta, Next.js, zustanda
  i rxjs. Reguła `no-restricted-imports` w ESLincie egzekwuje to mechanicznie.
- `src/application/ports/**` — interfejsy `ProgressRepository` i `TextProvider`.
- `src/infrastructure/**` — adaptery. Dziś `LocalProgressRepository` i
  `LoremTextProvider`, jutro odpowiedniki oparte na HTTP.
- `src/components/**` — prezentacja i wiązanie hooków, bez obliczeń domenowych.

## Konsekwencje

**Pozytywne**

- Silnik punktacji i ewaluacja challenge'y testują się bez DOM-u — 35 testów
  jednostkowych startuje w ~0,7 s, więc realnie uruchamia się je przy każdej zmianie.
- Dodanie backendu to nowy plik w `infrastructure/` i podmiana instancji.
  Domena i komponenty zostają nietknięte.
- `ProgressSnapshot.schemaVersion` pozwala odrzucić lub zmigrować dane graczy
  zapisane przez wcześniejsze wersje.

**Negatywne**

- Więcej plików i jedna warstwa pośrednia więcej niż wymaga dzisiejszy zakres.
- Trzeba pilnować kierunku zależności przy każdej zmianie. Częściowo zdjęte
  z człowieka przez regułę lintera.

**Do rewizji, gdy** pojawi się backend — wtedy `application/` dostanie realne
przypadki użycia (`startSession`, `finishSession`), a nie tylko porty i store'y.
