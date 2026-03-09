import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, Filter, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AddTransactionModal from '../components/AddTransactionModal';

const Transactions = () => {
    const { data } = useData();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filtered = data.transactions.filter(t => {
        const nameMatch = (t.recipientName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = (t.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ? true : t.type === filter;
        return (nameMatch || categoryMatch) && matchesFilter;
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '24px' }}>Transactions</h2>
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
                        boxShadow: '0 2px 4px rgba(46, 58, 140, 0.2)',
                        cursor: 'pointer',
                        border: 'none'
                    }}>
                    <Plus size={18} /> Add Transaction
                </button>
            </div>

            <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                        <input
                            type="text"
                            placeholder="Search by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            maxLength={100}
                            style={{
                                padding: '10px 10px 10px 40px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                width: '100%',
                                outline: 'none',
                                backgroundColor: 'white'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{
                                padding: '10px 36px 10px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'white',
                                appearance: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="all">All Transactions</option>
                            <option value="income">Income Only</option>
                            <option value="expense">Expense Only</option>
                        </select>
                        <Filter size={16} color="#9CA3AF" style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>TRANSACTION ID</th>
                            <th style={{ padding: '1rem', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>NAME</th>
                            <th style={{ padding: '1rem', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>CATEGORY</th>
                            <th style={{ padding: '1rem', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>DATE</th>
                            <th style={{ padding: '1rem', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>AMOUNT</th>
                            <th style={{ padding: '1rem', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((t) => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.1s' }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '12px', color: '#6B7280' }}>#{t.id ? t.id.slice(0, 8) : '00000000'}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                                            {t.recipientName ? t.recipientName.charAt(0) : 'T'}
                                        </div>
                                        {t.recipientName}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: '#F3F4F6', fontSize: '12px', color: '#4B5563' }}>{t.category}</span>
                                </td>
                                <td style={{ padding: '1rem', color: '#6B7280', fontSize: '14px' }}>{new Date(t.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', fontWeight: 600, color: t.type === 'income' ? '#059669' : '#DC2626' }}>
                                    {t.type === 'income' ? '+' : '-'}${Number(t.amount || 0).toLocaleString()}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        backgroundColor: t.status === 'completed' ? '#DEF7EC' : t.status === 'failed' ? '#FDE8E8' : '#FEF3C7',
                                        color: t.status === 'completed' ? '#03543F' : t.status === 'failed' ? '#9B1C1C' : '#92400E'
                                    }}>
                                        {t.status ? (t.status.charAt(0).toUpperCase() + t.status.slice(1)) : 'Completed'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
