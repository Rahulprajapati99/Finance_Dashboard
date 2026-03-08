import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard';
            case '/transactions': return 'Transactions';
            case '/wallet': return 'My Wallet';
            case '/goals': return 'Savings Goals';
            case '/analytics': return 'Analytics';
            case '/reports': return 'Reports';
            default: return 'Dashboard';
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
                <Header title={getTitle()} />
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
