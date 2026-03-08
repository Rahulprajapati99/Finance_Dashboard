"use client";
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    const titles = {
        '/': 'Dashboard',
        '/transactions': 'Transactions',
        '/wallet': 'My Wallet',
        '/goals': 'Savings Goals',
        '/analytics': 'Analytics',
        '/reports': 'Reports',
        '/settings': 'Settings',
        '/notifications': 'Notifications',
    };

    const title = titles[pathname] || 'Dashboard';

    return (
        <div id="layout-root" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
            <Sidebar />
            <div id="content-root" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'auto' }}>
                <Header title={title} />
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
