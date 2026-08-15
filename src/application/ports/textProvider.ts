import type { TextSource } from '@/domain/challenges/types';

/**
 * Port dostawcy tekstu do przepisania. Domena opisuje CZEGO chce
 * (`TextSource`), adapter decyduje SKĄD to weźmie — API, plik, generator.
 */
export interface TextProvider {
  /**
   * @param source Opis żądanego tekstu.
   * @param signal Sygnał anulowania — obowiązkowo respektowany przez adaptery sieciowe.
   * @throws {TextProviderError} gdy tekstu nie da się pobrać.
   */
  fetchText(source: TextSource, signal?: AbortSignal): Promise<string>;
}

export class TextProviderError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'TextProviderError';
  }
}
