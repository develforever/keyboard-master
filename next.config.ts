import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * React Compiler automatycznie memoizuje komponenty i wartości pochodne.
   * Dlatego w tym repo NIE piszemy ręcznych `useMemo` / `useCallback`
   * — patrz CLAUDE.md i ADR 0002.
   */
  reactCompiler: true,
};

export default nextConfig;
