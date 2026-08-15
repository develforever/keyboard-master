'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { TextProviderError } from '@/application/ports/textProvider';
import type { TextSource } from '@/domain/challenges/types';
import { LoremTextProvider } from '@/infrastructure/text/loremTextProvider';

import './ToTranscribe.css';

type LoadState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly text: string }
  | { readonly status: 'error'; readonly message: string };

/** Wynik przypięty do konkretnego źródła — pozwala odróżnić dane nieaktualne. */
interface LoadedState {
  readonly key: string;
  readonly value: LoadState;
}

const textProvider = new LoremTextProvider();

interface ToTranscribeProps {
  readonly source?: TextSource;
  /** Tekst gotowy do przepisania — wejście dla silnika sesji. */
  readonly onTextReady?: (text: string) => void;
}

export default function ToTranscribe({
  source = { kind: 'remote', paragraphs: 2 },
  onTextReady,
}: ToTranscribeProps) {
  // `source` bywa literałem tworzonym przy każdym renderze — porównujemy po zawartości.
  const sourceKey = JSON.stringify(source);
  const [loaded, setLoaded] = useState<LoadedState | null>(null);

  // Stan wyliczany podczas renderu: wynik dla nieaktualnego źródła = ponowne ładowanie.
  // Dzięki temu nie wołamy setState synchronicznie w efekcie (kaskadowe rendery).
  const state: LoadState = loaded?.key === sourceKey ? loaded.value : { status: 'loading' };

  useEffect(() => {
    const controller = new AbortController();
    const setState = (value: LoadState) => setLoaded({ key: sourceKey, value });

    textProvider
      .fetchText(source, controller.signal)
      .then((text) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({ status: 'ready', text });
        onTextReady?.(text);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof TextProviderError
            ? error.message
            : 'Nieoczekiwany błąd podczas pobierania tekstu.';

        console.error('[ToTranscribe] pobieranie tekstu nie powiodło się', error);
        setState({ status: 'error', message });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, onTextReady]);

  return (
    <div
      className={clsx(
        'to-transcribe mb-8 flex items-center justify-center border border-dashed border-gray-600 p-4',
        `to-transcribe--${state.status}`,
      )}
      aria-busy={state.status === 'loading'}
      aria-live="polite"
    >
      {state.status === 'loading' && <span className="text-gray-500">Wczytywanie tekstu…</span>}

      {state.status === 'ready' && (
        <span className="whitespace-pre-wrap font-mono text-gray-400">{state.text}</span>
      )}

      {state.status === 'error' && (
        <span className="text-red-400" role="alert">
          {state.message}
        </span>
      )}
    </div>
  );
}
