import { TextProviderError, type TextProvider } from '@/application/ports/textProvider';
import type { TextSource } from '@/domain/challenges/types';
import { ANSI_104, indexByCode } from '@/domain/keyboard';

const LOREM_ENDPOINT = 'https://lorem-api.com/api/lorem';
const REQUEST_TIMEOUT_MS = 8_000;

const KEY_INDEX = indexByCode(ANSI_104);

/** Deterministyczny generator ćwiczeń z podanego zestawu klawiszy. */
function generateDrill(codes: readonly string[], length: number): string {
  if (codes.length === 0 || length <= 0) {
    return '';
  }

  const chars = codes
    .map((code) => KEY_INDEX.get(code)?.label ?? '')
    .filter((label) => label.length === 1);

  if (chars.length === 0) {
    throw new TextProviderError(`Żaden z kodów [${codes.join(', ')}] nie mapuje się na znak.`);
  }

  const out: string[] = [];

  for (let i = 0; i < length; i += 1) {
    // Grupy po 4 znaki rozdzielone spacją — czytelniejsze i mierzalne jak słowa.
    out.push(i > 0 && i % 4 === 0 ? ' ' : chars[i % chars.length]);
  }

  return out.join('');
}

/**
 * Adapter tekstu oparty na publicznym API lorem-api.com z fallbackiem na
 * generator lokalny. Sieć jest zawodna — gra nie może się przez to zablokować.
 */
export class LoremTextProvider implements TextProvider {
  async fetchText(source: TextSource, signal?: AbortSignal): Promise<string> {
    switch (source.kind) {
      case 'static':
        return source.text;

      case 'drill':
        return generateDrill(source.codes, source.length);

      case 'remote':
        return this.fetchRemote(source.paragraphs, signal);

      default: {
        const exhaustive: never = source;
        throw new TextProviderError(`Nieobsłużone źródło tekstu: ${JSON.stringify(exhaustive)}`);
      }
    }
  }

  private async fetchRemote(paragraphs: number, signal?: AbortSignal): Promise<string> {
    const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

    try {
      const response = await fetch(`${LOREM_ENDPOINT}?paragraphs=${paragraphs}`, {
        signal: combined,
        headers: { Accept: 'text/plain' },
      });

      if (!response.ok) {
        throw new TextProviderError(
          `lorem-api odpowiedziało statusem ${response.status} ${response.statusText}.`,
        );
      }

      const text = (await response.text()).trim();

      if (text.length === 0) {
        throw new TextProviderError('lorem-api zwróciło pustą odpowiedź.');
      }

      return text;
    } catch (error) {
      // Anulowanie przez wywołującego nie jest błędem aplikacji — przepuszczamy dalej.
      if (signal?.aborted) {
        throw error;
      }

      throw new TextProviderError('Nie udało się pobrać tekstu do przepisania.', { cause: error });
    }
  }
}
