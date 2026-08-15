import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * Testy warstwy domenowej działają w środowisku `node` — domena nie dotyka DOM-u.
 * Testy komponentów deklarują `// @vitest-environment jsdom` na górze pliku.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/domain/**', 'src/application/**'],
    },
  },
});
