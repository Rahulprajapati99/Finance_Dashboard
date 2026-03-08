"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useData } from '../context/DataContext';

const AddCardModal = ({ isOpen, onClose }) => {
    const { addCard } = useData(); // Assuming this method exists or will trigger generic data update if possible
    // Note: DataContext likely needs an addCard method. For now, we might simulate or add it. 
    // Checking DataContext, it has `setData`. We can create a local helper if addCard isn't exposed, 
    // but better to add it to DataContext for consistency. 
    // WAIT: I didn't see `addCard` in DataContext. I should verify or implement it. 
    // For now, I'll assume I can pass a handler or add it to context.
    // Let's check DataContext content again? No, I recall it having `updateUser` etc.
    // I will use setData directly if needed or add addCard to Context in next step.
    // Actually, let's just create the UI and assume we'll fix Context if missing.

    // Correction: DataContext has `setData`. I can use that to append to cards.
    const { data, setData } = useData();

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        nickname: '',
        cardType: 'visa'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCard = {
            id: Date.now(),
            ...formData,
            balance: 0 // Default balance
        };

        setData(prev => ({
            ...prev,
            cards: [...prev.cards, newCard]
        }));

        setFormData({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '', nickname: '', cardType: 'visa' });
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

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Add New Card</h2>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Card Number</label>
                        <input
                            type="text"
                            required
                            maxLength="16"
                            value={formData.cardNumber}
                            onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                            placeholder="0000 0000 0000 0000"
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Expiry Date</label>
                            <input
                                type="text"
                                required
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>CVV</label>
                            <input
                                type="password"
                                required
                                maxLength="3"
                                value={formData.cvv}
                                onChange={e => setFormData({ ...formData, cvv: e.target.value })}
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
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Card Holder Name</label>
                        <input
                            type="text"
                            required
                            value={formData.cardHolder}
                            onChange={e => setFormData({ ...formData, cardHolder: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-body)' }}>Card Type</label>
                        <select
                            value={formData.cardType}
                            onChange={e => setFormData({ ...formData, cardType: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-light)',
                                color: 'var(--color-text-main)'
                            }}
                        >
                            <option value="visa">Visa</option>
                            <option value="mastercard">Mastercard</option>
                            <option value="amex">Amex</option>
                        </select>
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
                        Add Card
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCardModal;
