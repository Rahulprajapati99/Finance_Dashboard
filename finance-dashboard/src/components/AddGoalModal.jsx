"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useData } from '../context/DataContext';

const AddGoalModal = ({ isOpen, onClose }) => {
    const { addGoal } = useData();
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        targetDate: ''
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Goal name is required.');
            return;
        }

        if (formData.name.length > 50) {
            setError('Goal name is too long (max 50 characters).');
            return;
        }

        const target = Number(formData.targetAmount);
        if (isNaN(target) || target <= 0) {
            setError('Target amount must be greater than 0.');
            return;
        }

        const current = Number(formData.currentAmount);
        if (isNaN(current) || current < 0) {
            setError('Initial savings cannot be negative.');
            return;
        }

        if (!formData.targetDate) {
            setError('Target date is required.');
            return;
        }

        addGoal({
            ...formData,
            name: formData.name.trim(),
            targetAmount: target,
            currentAmount: current
        });
        setFormData({ name: '', targetAmount: '', currentAmount: '0', targetDate: '' });
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '500px',
                boxShadow: 'var(--shadow-card)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        padding: '8px'
                    }}
                >
                    <X size={24} color="var(--color-text-body)" />
                </button>

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Add Savings Goal</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#FEE2E2',
                        color: '#B91C1C',
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        fontSize: '13px',
                        fontWeight: 500,
                        border: '1px solid #FECACA'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Goal Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. New Car"
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Target Amount ($)</label>
                        <input
                            type="number"
                            required
                            value={formData.targetAmount}
                            onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Initial Savings ($)</label>
                        <input
                            type="number"
                            value={formData.currentAmount}
                            onChange={e => setFormData({ ...formData, currentAmount: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Target Date</label>
                        <input
                            type="date"
                            required
                            value={formData.targetDate}
                            onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
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
                        type="submit"
                        style={{
                            marginTop: '1rem',
                            padding: '12px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            fontSize: '16px'
                        }}
                    >
                        Create Goal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddGoalModal;
