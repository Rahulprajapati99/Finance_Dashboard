import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Wallet, Target, PieChart, FileText, X, LogOut } from 'lucide-react';
import { useData } from '../context/DataContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { data, isLoading, logout } = useData();

    if (isLoading || !data) return null; // Or a loading skeleton

    const { user } = data; // Assuming data is guaranteed to exist here and has a user property

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
        { path: '/goals', label: 'Goals', icon: Target },
        { path: '/analytics', label: 'Analytics', icon: PieChart },
        { path: '/reports', label: 'Reports', icon: FileText },
    ];

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{
            width: '280px',
            background: 'linear-gradient(180deg, var(--color-navy) 0%, #0F172A 100%)',
            color: 'white',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            zIndex: 20,
            boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
            transition: 'left 0.3s ease'
        }}>
            <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    letterSpacing: '-0.5px',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                }}>
                    RP Solutionss
                </h2>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="mobile-close-btn"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        display: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>
            </div>

            <nav style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                            if (window.innerWidth <= 768) {
                                setIsOpen(false);
                            }
                        }}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.875rem 1rem',
                            color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                            background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            marginBottom: '0.5rem',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} style={{ marginRight: '12px', opacity: isActive ? 1 : 0.7 }} />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            fontWeight: 'bold',
                            color: 'white',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            flexShrink: 0
                        }}>
                            {user ? getInitials(user.name) : 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '120px' }}>
                                {user ? user.name : 'Loading...'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        title="Logout"
                        style={{
                            color: '#EF4444',
                            background: 'none',
                            border: 'none',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
