"use client";



import React from 'react';
import { useData } from '@/context/DataContext';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
    const { data } = useData();
    const { transactions } = data;

    // Mock data for Line Chart (Spending Trends) - In a real app, this would aggregate `transactions` by date
    const spendingTrendsData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'This Month',
                data: [450, 1200, 800, 600],
                borderColor: '#2E3A8C',
                backgroundColor: 'rgba(46, 58, 140, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Last Month',
                data: [400, 900, 850, 700],
                borderColor: '#9CA3AF',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4,
            },
        ],
    };

    // Category Breakdown Data
    const categories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
    });

    const categoryData = {
        labels: Object.keys(categories).length ? Object.keys(categories) : ['Food', 'Transport', 'Utilities'],
        datasets: [
            {
                data: Object.keys(categories).length ? Object.values(categories) : [300, 150, 200],
                backgroundColor: [
                    '#2E3A8C', '#4A5FD9', '#FF9800', '#4CAF50', '#F44336', '#9C27B0'
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div>
            <h2 style={{ fontSize: '24px', marginBottom: '2rem' }}>Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Spending Trends */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)', height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '18px' }}>Spending Trends</h3>
                    <div style={{ height: '300px' }}>
                        <Line data={spendingTrendsData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, grid: { color: '#F3F4F6' } }, x: { grid: { display: false } } } }} />
                    </div>
                </div>

                {/* Category Breakdown */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)', height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '18px' }}>Expenses by Category</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
            </div>

            {/* Top Expenses List */}
            <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '18px' }}>Top Expenses</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-body)', fontSize: '12px', textAlign: 'left' }}>
                            <th style={{ padding: '12px', fontWeight: 600 }}>TRANSACTION</th>
                            <th style={{ padding: '12px', fontWeight: 600 }}>CATEGORY</th>
                            <th style={{ padding: '12px', fontWeight: 600 }}>DATE</th>
                            <th style={{ padding: '12px', fontWeight: 600, textAlign: 'right' }}>AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 5).map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '12px', fontWeight: 500 }}>{t.recipientName}</td>
                                <td style={{ padding: '12px', color: '#6B7280' }}>{t.category}</td>
                                <td style={{ padding: '12px', color: '#6B7280' }}>{new Date(t.date).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', fontWeight: 600, textAlign: 'right' }}>-${Number(t.amount).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Analytics;
