import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Wallet, Target, PieChart, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';

const Sidebar = () => {
    const { data, isLoading } = useData();

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
        <aside style={{
            width: '280px',
            background: 'linear-gradient(180deg, var(--color-navy) 0%, #0F172A 100%)',
            color: 'white',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 10,
            boxShadow: '4px 0 24px rgba(0,0,0,0.1)'
        }}>
            <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    letterSpacing: '-0.5px',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    RP Solutionss
                </h2>
            </div>

            <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
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
                    backdropFilter: 'blur(10px)'
                }}>
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
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        {user ? getInitials(user.name) : 'JD'}
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
                            {user ? user.name : 'Loading...'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>View Profile</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
