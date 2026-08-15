import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import Wrapper from '@/components/wrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: 'Keyboard Master',
  description: 'Trening pisania bezwzrokowego z challenge’ami, combo i punktacją.',
};

export const viewport: Viewport = {
  themeColor: '#0e0e11',
};

/**
 * Root layout jest komponentem serwerowym: `<html>` i `<body>` muszą powstać
 * po stronie serwera, inaczej cała aplikacja wpada do bundla klienta i tracimy
 * RSC. Granica klienta zaczyna się dopiero w `Wrapper`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
