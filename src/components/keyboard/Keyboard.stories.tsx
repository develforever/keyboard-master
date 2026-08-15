import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ANSI_104 } from '@/domain/keyboard';

import Keyboard from './Keyboard';

const meta = {
  title: 'Keyboard/Keyboard',
  component: Keyboard,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
  args: {
    layout: ANSI_104,
    hintedCode: null,
  },
} satisfies Meta<typeof Keyboard>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Stan spoczynkowy. Naciskaj klawisze — komponent nasłuchuje globalnie. */
export const Default: Story = {};

/** Podpowiedź następnego klawisza — tryb nauki. */
export const WithHint: Story = {
  args: {
    hintedCode: 'KeyF',
  },
};
