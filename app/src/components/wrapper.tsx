'use client';

import { AppContext, AppContextInterface, AppProvider, useAppContext } from "@/app/context";
import { useContext, useState } from "react";
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
    const appContext = useAppContext();

    return (
        <html lang={appContext.lang}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
