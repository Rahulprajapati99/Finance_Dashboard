import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { User, Shield, Bell, Moon, Sun, Trash2, Save } from 'lucide-react';

const Settings = () => {
    const { data, updateUser, resetData } = useData();
    const { isDarkMode, toggleTheme } = useTheme();
    const [name, setName] = useState(data.user.name);
    const [limit, setLimit] = useState(data.user.monthlySpendingLimit);

    const handleSaveProfile = () => {
        updateUser({ name, monthlySpendingLimit: limit });
        alert('Profile updated successfully!');
    };

    const Section = ({ title, icon: Icon, children }) => (
        <div style={{
            backgroundColor: 'var(--color-white)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'var(--color-bg-light)',
                    marginRight: '1rem'
                }}>
                    <Icon size={24} color="var(--color-primary)" />
                </div>
                <h3 style={{ margin: 0 }}>{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div style={{ paddingBottom: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Settings</h2>

            <Section title="Profile Settings" icon={User}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-light)',
                                color: 'var(--color-text-main)'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Monthly Spending Limit ($)</label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-light)',
                                color: 'var(--color-text-main)'
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSaveProfile}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            padding: '12px 24px',
                            width: 'fit-content'
                        }}
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </Section>

            <Section title="App Preferences" icon={Bell}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ marginBottom: '4px' }}>Theme</h4>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-body)' }}>Switch between day and night mode</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            background: 'var(--color-bg-light)',
                            color: 'var(--color-text-main)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        {isDarkMode ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
                    </button>
                </div>
            </Section>

            <Section title="Danger Zone" icon={Shield}>
                <div>
                    <h4 style={{ marginBottom: '4px', color: '#EF4444' }}>Reset Application</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-body)', marginBottom: '1rem' }}>
                        This will delete all local data and reset the application to its initial state. This action cannot be undone.
                    </p>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete all data?')) {
                                resetData();
                            }
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            padding: '12px 24px',
                            border: '1px solid #fecaca'
                        }}
                    >
                        <Trash2 size={18} />
                        Reset Data
                    </button>
                </div>
            </Section>
        </div>
    );
};

export default Settings;
