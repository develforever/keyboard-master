'use client';

import { AppContext } from "@/app/context";
import { useContext } from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export default function Wrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const appContext = useContext(AppContext);
    return (
        <AppContext.Provider value={{ lang: 'en' }}>{children}
            <html lang={appContext.lang}>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    {children}
                </body>
            </html>
        </AppContext.Provider>
    );
}
