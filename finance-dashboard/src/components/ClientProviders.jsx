"use client";
import { ThemeProvider } from '@/context/ThemeContext';
import { DataProvider } from '@/context/DataContext';

export default function ClientProviders({ children }) {
    return (
        <ThemeProvider>
            <DataProvider>
                {children}
            </DataProvider>
        </ThemeProvider>
    );
}
