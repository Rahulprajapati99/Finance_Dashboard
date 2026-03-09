"use client";

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Target, Plus, TrendingUp } from 'lucide-react';
import AddGoalModal from '@/components/AddGoalModal';

const Goals = () => {
    const { data, totalSavings } = useData();
    const { goals } = data;
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sequential Allocation (Envelope Method)
    const sortedGoals = [...goals].sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));

    let remainingSavings = totalSavings;
    const allocatedGoals = sortedGoals.map(goal => {
        const needed = goal.targetAmount;
        const allocated = Math.min(needed, Math.max(0, remainingSavings));
        remainingSavings -= allocated;
        return { ...goal, allocated };
    });

    const surplus = Math.max(0, remainingSavings);

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

            {/* Surplus Summary Card */}
            {surplus > 0 && (
                <div style={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #10B981',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{ backgroundColor: '#10B981', padding: '8px', borderRadius: '50%', color: 'white' }}>
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h4 style={{ color: '#065F46', fontWeight: 600 }}>Unallocated Surplus</h4>
                        <p style={{ color: '#047857', fontSize: '14px' }}>You have <strong>${surplus.toLocaleString()}</strong> in extra savings not assigned to any goal.</p>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {allocatedGoals.map((goal) => {
                    const percentage = Math.round((goal.allocated / goal.targetAmount) * 100);
                    const isMet = percentage >= 100;

                    return (
                        <div key={goal.id} style={{
                            backgroundColor: 'var(--color-white)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-card)',
                            border: isMet ? '2px solid #10B981' : '1px solid transparent'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '10px', backgroundColor: isMet ? '#D1FAE5' : '#E0E7FF', borderRadius: '8px' }}>
                                        <Target size={20} color={isMet ? '#059669' : 'var(--color-primary)'} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{goal.name}</h3>
                                        <p style={{ fontSize: '12px', color: '#6B7280' }}>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: isMet ? '#059669' : 'var(--color-primary)' }}>{percentage}%</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                                    <span>${goal.allocated.toLocaleString()} saved</span>
                                    <span style={{ color: '#6B7280' }}>of ${goal.targetAmount.toLocaleString()}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${percentage}%`,
                                        height: '100%',
                                        backgroundColor: isMet ? '#10B981' : 'var(--color-primary)',
                                        borderRadius: '4px',
                                        transition: 'width 0.5s ease'
                                    }}></div>
                                </div>
                            </div>

                            <div style={{
                                borderTop: '1px solid #F3F4F6',
                                paddingTop: '1rem',
                                marginTop: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: isMet ? '#059669' : '#2E7D32',
                                fontSize: '13px',
                                fontWeight: 500
                            }}>
                                {isMet ? (
                                    <>✨ Goal Achieved! 🎉</>
                                ) : (
                                    <>
                                        <TrendingUp size={16} />
                                        On track to reach goal by {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Goals;
