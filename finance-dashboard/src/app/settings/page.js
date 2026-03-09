"use client";

import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { User, Shield, Bell, Moon, Sun, Trash2, Save, DollarSign } from 'lucide-react';

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

const Settings = () => {
    const { data, updateUser, resetData } = useData();
    const { isDarkMode, toggleTheme } = useTheme();
    const [limit, setLimit] = useState(data?.user?.monthlySpendingLimit || '');
    const [error, setError] = useState('');
    const [catBudget, setCatBudget] = useState(data?.user?.categoryBudget || {});

    useEffect(() => {
        if (data?.user) {
            setLimit(data.user.monthlySpendingLimit === null ? '' : data.user.monthlySpendingLimit);
            setCatBudget(data.user.categoryBudget || {});
        }
    }, [data?.user?.monthlySpendingLimit, data?.user?.categoryBudget]);

    const handleSaveLimit = async () => {
        setError('');
        if (limit !== '' && (isNaN(limit) || Number(limit) < 0)) {
            setError('Monthly spending limit must be a positive number.');
            return;
        }
        try {
            await updateUser({
                monthlySpendingLimit: limit === '' ? null : Number(limit)
            });
            alert('Monthly spending limit updated!');
        } catch (err) {
            setError('Failed to save: ' + err.message);
        }
    };

    const handleSaveBudget = async () => {
        try {
            await updateUser({ categoryBudget: catBudget });
            alert('Budget updated successfully!');
        } catch (err) {
            setError('Failed to save budget: ' + err.message);
        }
    };

    const handleResetBudget = async () => {
        if (window.confirm('Are you sure you want to reset your category budget?')) {
            const reset = Object.keys(catBudget).reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});
            setCatBudget(reset);
            try {
                await updateUser({ categoryBudget: reset });
                alert('Budget reset successfully!');
            } catch (err) {
                setError('Failed to reset budget: ' + err.message);
            }
        }
    };

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

            {/* Profile - Read Only */}
            <Section title="Profile" icon={User}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Display Name</label>
                        <input
                            type="text"
                            value={data?.user?.name || ''}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                background: '#f0f0f0',
                                color: '#666',
                                cursor: 'not-allowed'
                            }}
                        />
                        <p style={{ fontSize: '12px', color: 'var(--color-text-body)', marginTop: '4px' }}>
                            Automatically set from your Google account.
                        </p>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                        <input
                            type="text"
                            value={data?.user?.email || '—'}
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                background: '#f0f0f0',
                                color: '#666',
                                cursor: 'not-allowed'
                            }}
                        />
                    </div>
                </div>
            </Section>

            {/* Monthly Spending Limit */}
            <Section title="Monthly Spending Limit" icon={DollarSign}>
                <p style={{ color: 'var(--color-text-body)', fontSize: '14px', marginBottom: '1rem' }}>
                    Set an overall monthly spending limit. This will be used across the Dashboard and Analytics to track your spending.
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                    <div style={{ flex: 1, maxWidth: '300px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Limit ($)</label>
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
                    <button
                        onClick={handleSaveLimit}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            height: '46px'
                        }}
                    >
                        <Save size={18} />
                        Save Limit
                    </button>
                </div>
            </Section>

            {/* Category Budget */}
            <Section title="Category Budget" icon={Save}>
                <p style={{ color: 'var(--color-text-body)', fontSize: '14px', marginBottom: '1.5rem' }}>
                    Set individual monthly limits for each spending category. These will show up in your Dashboard graph.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    {Object.keys(catBudget).map(cat => (
                        <div key={cat}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '13px', fontWeight: 500 }}>{cat}</label>
                            <input
                                type="number"
                                value={catBudget[cat]}
                                onChange={(e) => setCatBudget({ ...catBudget, [cat]: Number(e.target.value) })}
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
                        onClick={handleSaveBudget}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: 'var(--color-primary)', color: 'white',
                            padding: '12px 24px', borderRadius: '8px', fontWeight: 600,
                            cursor: 'pointer', border: 'none'
                        }}
                    >
                        <Save size={18} />
                        Save Budget
                    </button>
                    <button
                        onClick={handleResetBudget}
                        style={{ padding: '12px 20px', background: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Reset Budget
                    </button>
                </div>
            </Section>

            {/* App Preferences */}
            <Section title="App Preferences" icon={Bell}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ marginBottom: '4px' }}>Theme</h4>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-body)' }}>Switch between day and night mode</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px', background: 'var(--color-bg-light)',
                            color: 'var(--color-text-main)', border: '1px solid var(--color-border)',
                            borderRadius: '8px', cursor: 'pointer'
                        }}
                    >
                        {isDarkMode ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
                    </button>
                </div>
            </Section>

            {/* Danger Zone */}
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
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#fee2e2', color: '#dc2626',
                            padding: '12px 24px', border: '1px solid #fecaca',
                            borderRadius: '8px', cursor: 'pointer'
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
