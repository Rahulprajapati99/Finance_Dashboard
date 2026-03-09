"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useData } from '../context/DataContext';

const AddTransactionModal = ({ isOpen, onClose }) => {
    const { addTransaction } = useData();
    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        category: 'Food & Grocery',
        recipientName: '',
        notes: ''
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const amountNum = Number(formData.amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid amount greater than 0.');
            return;
        }

        if (!formData.recipientName.trim()) {
            setError('Recipient/Payer name is required.');
            return;
        }

        if (formData.recipientName.length > 100) {
            setError('Name is too long (max 100 characters).');
            return;
        }

        addTransaction({
            ...formData,
            recipientName: formData.recipientName.trim(),
            notes: (formData.notes || '').trim(),
            status: 'completed',
            amount: amountNum
        });
        setFormData({ amount: '', type: 'expense', category: 'Food & Grocery', recipientName: '', notes: '' });
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

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Add Transaction</h2>

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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Type</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['income', 'expense'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: formData.type === type ? 'var(--color-primary)' : 'var(--color-bg-light)',
                                        color: formData.type === type ? 'white' : 'var(--color-text-body)',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Amount ($)</label>
                        <input
                            type="number"
                            required
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Category</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-light)',
                                color: 'var(--color-text-main)'
                            }}
                        >
                            <option>Salary</option>
                            <option>Food & Grocery</option>
                            <option>Transport</option>
                            <option>Bills & Utilities</option>
                            <option>Entertainment</option>
                            <option>Healthcare</option>
                            <option>Investment</option>
                            <option>Others</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Recipient / Payer</label>
                        <input
                            type="text"
                            required
                            value={formData.recipientName}
                            onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
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
                        Add Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
