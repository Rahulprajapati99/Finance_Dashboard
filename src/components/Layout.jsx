import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on mobile when route changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        setIsSidebarOpen(false);
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard';
            case '/transactions': return 'Transactions';
            case '/wallet': return 'My Wallet';
            case '/goals': return 'Savings Goals';
            case '/analytics': return 'Analytics';
            case '/reports': return 'Reports';
            case '/settings': return 'Settings';
            case '/notifications': return 'Notifications';
            default: return 'Dashboard';
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)', position: 'relative' }}>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 15,
                        display: window.innerWidth <= 768 ? 'block' : 'none'
                    }}
                />
            )}

            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s' }}>
                <Header title={getTitle()} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }} className="mobile-padding">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
