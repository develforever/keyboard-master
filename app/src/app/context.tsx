'use client'

import { createContext, useContext, useCallback, useState } from 'react'

export interface AppContextInterface {
    lang: string;
    isReady: boolean;
    setLang: (lang: string) => void;
    setIsReady: (isReady: boolean) => void;
}

export const AppContext = createContext<AppContextInterface | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState("pl");
    const [isReady, setIsReady] = useState(false);

    const value: AppContextInterface = {
        lang,
        setLang,
        isReady,
        setIsReady,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useAppContext must be used within AppProvider");
    return ctx;
}