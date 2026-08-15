import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import storybook from 'eslint-plugin-storybook';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...storybook.configs['flat/recommended'],

  {
    rules: {
      // Warstwa domenowa i porty mają być w pełni otypowane.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  {
    // Domena musi zostać czysta: żadnych importów z Reacta, Next.js ani infrastruktury.
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-dom',
                'next',
                'next/*',
                'zustand',
                'rxjs',
                '@/components/*',
                '@/infrastructure/*',
              ],
              message:
                'src/domain musi pozostać czystym TypeScriptem — bez zależności od UI, frameworka i infrastruktury.',
            },
          ],
        },
      ],
    },
  },

  {
    // Skrypty deweloperskie to narzędzia CLI — wypisywanie na stdout jest ich zadaniem.
    files: ['scripts/**/*.{ts,mts}'],
    rules: {
      'no-console': 'off',
    },
  },

  // Prettier na końcu — wyłącza reguły formatujące kolidujące z formaterem.
  prettier,

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'storybook-static/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
