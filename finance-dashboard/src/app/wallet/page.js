"use client";



import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Plus } from 'lucide-react';
import AddCardModal from '@/components/AddCardModal';

const Wallet = () => {
    const { data } = useData();
    const { cards } = data;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '24px' }}>My Wallet</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderRadius: '8px',
                        fontWeight: 600
                    }}>
                    <Plus size={18} /> Add New Card
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {cards.map((card) => (
                    <div key={card.id} style={{
                        background: 'linear-gradient(135deg, #2E3A8C 0%, #4A5FD9 100%)',
                        borderRadius: '16px',
                        padding: '24px',
                        color: 'white',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 8px 16px rgba(46, 58, 140, 0.25)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Visual shine effect */}
                        <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '200%', background: 'rgba(255,255,255,0.05)', transform: 'rotate(45deg)' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                            <span style={{ fontSize: '14px', opacity: 0.9 }}>{card.nickname || 'Personal Card'}</span>
                            <span style={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px' }}>
                                {card.cardType.toUpperCase()}
                            </span>
                        </div>

                        <div style={{ fontSize: '24px', letterSpacing: '3px', fontFamily: 'monospace', zIndex: 1, margin: '1rem 0' }}>
                            **** **** **** {card.cardNumber.slice(-4)}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', zIndex: 1 }}>
                            <div>
                                <div style={{ opacity: 0.7, fontSize: '10px', textTransform: 'uppercase' }}>Card Holder</div>
                                <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>{card.cardHolder.toUpperCase()}</div>
                            </div>
                            <div>
                                <div style={{ opacity: 0.7, fontSize: '10px', textTransform: 'uppercase' }}>Expires</div>
                                <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>{card.expiryDate}</div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Card Placeholder */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        border: '2px dashed #CBD5E1',
                        borderRadius: '16px',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F8FAFC',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px'
                    }}>
                        <Plus size={24} color="#64748B" />
                    </div>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Add New Card</span>
                </button>
            </div>

            <AddCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Wallet;
