'use client';

import { useEffect } from 'react';

import { AppProvider, useAppContext } from '@/app/context';

/** Utrzymuje `<html lang>` w zgodzie z językiem wybranym w aplikacji. */
function LangSync({ children }: Readonly<{ children: React.ReactNode }>) {
  const { lang } = useAppContext();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <>{children}</>;
}

/**
 * Jedyna granica klient/serwer w drzewie aplikacji. Tutaj montujemy providery,
 * które wymagają stanu przeglądarki.
 */
export default function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppProvider>
      <LangSync>{children}</LangSync>
    </AppProvider>
  );
}
