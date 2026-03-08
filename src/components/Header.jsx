import React from 'react';
import { Bell, Search, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
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
        }}>
            <h2 style={{
                fontSize: '24px',
                color: 'var(--color-text-main)',
            }}>{title || 'Dashboard'}</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative', marginRight: '1rem' }}>
                    <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            padding: '10px 10px 10px 42px',
                            borderRadius: '12px',
                            border: '1px solid transparent',
                            backgroundColor: 'var(--color-bg-light)', /* Dynamic bg */
                            width: '280px',
                            outline: 'none',
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            color: 'var(--color-text-main)'
                        }}
                        onFocus={(e) => {
                            e.target.style.backgroundColor = 'var(--color-white)';
                            e.target.style.border = '1px solid var(--color-primary)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(46, 58, 140, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.backgroundColor = 'var(--color-bg-light)';
                            e.target.style.border = '1px solid transparent';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

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
