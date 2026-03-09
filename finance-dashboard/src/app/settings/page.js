"use client";

import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { User, Shield, Bell, Moon, Sun, Trash2, Save } from 'lucide-react';

const Settings = () => {
    const { data, updateUser, resetData } = useData();
    const { isDarkMode, toggleTheme } = useTheme();
    const [catBudgets, setCatBudgets] = useState(data?.user?.categoryBudgets || {});

    // Sync local state when context data changes (e.g. after sync from Supabase)
    useEffect(() => {
        if (data?.user) {
            setName(data.user.name || '');
            setLimit(data.user.monthlySpendingLimit === null ? '' : data.user.monthlySpendingLimit);
            setCatBudgets(data.user.categoryBudgets || {});
        }
    }, [data?.user?.name, data?.user?.monthlySpendingLimit, data?.user?.categoryBudgets]);

    const handleSaveProfile = async () => {
        setError('');

        // Validation
        if (!name.trim()) {
            setError('Display name is required.');
            return;
        }
        if (name.length > 50) {
            setError('Display name must be under 50 characters.');
            return;
        }
        if (limit !== '' && (isNaN(limit) || Number(limit) < 0)) {
            setError('Monthly spending limit must be a positive number.');
            return;
        }

        await updateUser({
            name: name.trim(),
            monthlySpendingLimit: limit === '' ? null : Number(limit),
            categoryBudgets: catBudgets
        });
        alert('Profile updated successfully!');
    };

    const handleResetBudgets = (type) => {
        if (window.confirm(`Are you sure you want to reset all category budgets ${type}?`)) {
            const reset = Object.keys(catBudgets).reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});
            setCatBudgets(reset);
            updateUser({ categoryBudgets: reset });
        }
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

            {error && (
                <div style={{
                    backgroundColor: '#FEE2E2',
                    color: '#B91C1C',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    fontSize: '14px',
                    fontWeight: 500,
                    border: '1px solid #FECACA'
                }}>
                    {error}
                </div>
            )}

            <Section title="Profile Settings" icon={User}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Overall Monthly Limit ($)</label>
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
                                placeholder="e.g. 5000"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Category Budgets" icon={Save}>
                <p style={{ color: 'var(--color-text-body)', fontSize: '14px', marginBottom: '1.5rem' }}>
                    Set individual monthly limits for each spending category. These will show up in your Dashboard graphs.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    {Object.keys(catBudgets).map(cat => (
                        <div key={cat}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '13px', fontWeight: 500 }}>{cat}</label>
                            <input
                                type="number"
                                value={catBudgets[cat]}
                                onChange={(e) => setCatBudgets({ ...catBudgets, [cat]: Number(e.target.value) })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-light)'
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleSaveProfile}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            padding: '12px 24px'
                        }}
                    >
                        <Save size={18} />
                        Save Budgets
                    </button>
                    <button
                        onClick={() => handleResetBudgets('Monthly')}
                        style={{ padding: '12px 20px', background: 'var(--color-bg-light)', border: '1px solid var(--color-border)' }}
                    >
                        Reset Monthly
                    </button>
                    <button
                        onClick={() => handleResetBudgets('Annually')}
                        style={{ padding: '12px 20px', background: 'var(--color-bg-light)', border: '1px solid var(--color-border)' }}
                    >
                        Reset Annually
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
