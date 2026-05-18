import React from 'react';
import { Bell, Settings, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, toggleSidebar }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <header style={{
            height: '80px',
            background: 'rgba(255, 255, 255, 0.1)', /* More glass-like */
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 5,
            transition: 'all 0.3s ease'
        }} className="mobile-header-padding">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-main)',
                        display: 'none', // Hidden on desktop, shown via CSS class on mobile
                    }}
                    className="mobile-menu-btn"
                >
                    <Menu size={24} />
                </button>
                <h2 style={{
                    fontSize: '24px',
                    color: 'var(--color-text-main)',
                    margin: 0
                }}>{title || 'Dashboard'}</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'var(--color-white)',
                            padding: '10px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="card-hover"
                    >
                        {isDarkMode ?
                            <Sun size={20} color="var(--color-text-body)" /> :
                            <Moon size={20} color="var(--color-text-body)" />
                        }
                    </button>

                    {/* Settings Button */}
                    <button
                        onClick={() => navigate('/settings')}
                        style={{
                            background: 'var(--color-white)',
                            padding: '10px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="card-hover"
                    >
                        <Settings size={20} color="var(--color-text-body)" />
                    </button>

                    {/* Notifications Button */}
                    <button
                        onClick={() => navigate('/notifications')}
                        style={{
                            background: 'var(--color-white)',
                            padding: '10px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="card-hover"
                    >
                        <Bell size={20} color="var(--color-text-body)" />
                        {/* Dot indicator could be dynamic based on unread count */}
                        <span style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#EF4444',
                            borderRadius: '50%',
                            border: '2px solid white'
                        }}></span>
                    </button>

                </div>
            </div>
        </header>
    );
};

export default Header;
