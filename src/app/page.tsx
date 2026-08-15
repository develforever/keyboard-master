'use client';

import { useState } from 'react';

import Keyboard from '@/components/keyboard/Keyboard';
import ToTranscribe from '@/components/ToTranscribe';

/**
 * Ekran treningu. Warstwa prezentacji spina komponenty — logika sesji, punktacji
 * i challenge'y żyje w `src/domain` i `src/application`.
 */
export default function Home() {
  const [text, setText] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen flex-col justify-center gap-4 bg-zinc-950 p-4 font-sans">
      <ToTranscribe onTextReady={setText} />

      <div className="flex-1">
        <Keyboard />
      </div>

      <p className="text-center text-xs text-gray-600">
        {text === null ? 'Czekam na tekst…' : `Znaków do przepisania: ${text.length}`}
      </p>
    </main>
  );
}
