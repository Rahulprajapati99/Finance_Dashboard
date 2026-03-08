"use client";



import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Target, Plus, TrendingUp } from 'lucide-react';
import AddGoalModal from '@/components/AddGoalModal';

const Goals = () => {
    const { data } = useData();
    const { goals } = data;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '24px' }}>Savings Goals</h2>
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
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none'
                    }}>
                    <Plus size={18} /> New Goal
                </button>
            </div>

            <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {goals.map((goal) => {
                    const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

                    return (
                        <div key={goal.id} style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '10px', backgroundColor: '#E0E7FF', borderRadius: '8px' }}>
                                        <Target size={20} color="var(--color-primary)" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{goal.name}</h3>
                                        <p style={{ fontSize: '12px', color: '#6B7280' }}>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>{percentage}%</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                                    <span>${goal.currentAmount.toLocaleString()} saved</span>
                                    <span style={{ color: '#6B7280' }}>of ${goal.targetAmount.toLocaleString()}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#2E7D32', fontSize: '13px', fontWeight: 500 }}>
                                <TrendingUp size={16} />
                                On track to reach goal by {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Goals;
