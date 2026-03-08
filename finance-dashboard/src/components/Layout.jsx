"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { usePathname } from 'next/navigation';

const Layout = ({ children }) => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log('Layout component mounted. Pathname:', pathname);
    }, [pathname]);

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

    // Failsafe: if not mounted yet, just render a simple container to avoid hydration flickering
    // Once mounted, render the full layout with Sidebar and Header
    if (!mounted) {
        return <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>{children}</div>;
    }

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
};

export default Layout;
