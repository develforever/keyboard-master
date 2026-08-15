import type { StorybookConfig } from '@storybook/nextjs-vite';

/**
 * Storybook 10 ma dawne `addon-essentials` wbudowane w rdzeń — lista `addons`
 * jest celowo pusta. Wcześniej wskazywała na trzy paczki, których nie ma
 * w `package.json`, przez co `npm run storybook` nie wstawał.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
};

export default config;
