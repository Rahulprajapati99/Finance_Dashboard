"use client";

import React, { useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const Analytics = () => {
    const { data } = useData();
    const transactions = data?.transactions || [];

    // Calculate Dynamic Analytics
    const analyticsData = useMemo(() => {
        const dailyData = {};
        const categories = {};
        const now = new Date();

        // Initialize last 7 days with stable keys (YYYY-MM-DD)
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const key = d.toISOString().split('T')[0];
            dailyData[key] = {
                income: 0,
                expense: 0,
                label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            };
        }

        transactions.forEach(t => {
            const txDate = new Date(t.date);
            const key = txDate.toISOString().split('T')[0];
            const amount = Number(t.amount) || 0;

            if (dailyData[key] !== undefined) {
                if (t.type === 'income') dailyData[key].income += amount;
                else dailyData[key].expense += amount;
            }

            if (t.type === 'expense') {
                categories[t.category] = (categories[t.category] || 0) + amount;
            }
        });

        const keys = Object.keys(dailyData).sort();
        const labels = keys.map(k => dailyData[k].label);
        const incomeTrend = keys.map(k => dailyData[k].income);
        const expenseTrend = keys.map(k => dailyData[k].expense);

        return { labels, incomeTrend, expenseTrend, categories };
    }, [transactions]);

    const spendingTrendsData = {
        labels: analyticsData.labels,
        datasets: [
            {
                label: 'Income',
                data: analyticsData.incomeTrend,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Expenses',
                data: analyticsData.expenseTrend,
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const categoryData = {
        labels: Object.keys(analyticsData.categories).length ? Object.keys(analyticsData.categories) : ['No Data'],
        datasets: [{
            data: Object.keys(analyticsData.categories).length ? Object.values(analyticsData.categories) : [1],
            backgroundColor: ['#2E3A8C', '#4A5FD9', '#FF9800', '#4CAF50', '#F44336', '#9C27B0'],
            borderWidth: 0,
        }],
    };

    return (
        <div>
            <h2 style={{ fontSize: '24px', marginBottom: '2rem' }}>Analytics</h2>

            <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="chart-container" style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)', height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '18px' }}>Income vs Expenses (7 Days)</h3>
                    <div style={{ height: '300px' }}>
                        <Line data={spendingTrendsData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, grid: { color: '#F3F4F6' } }, x: { grid: { display: false } } } }} />
                    </div>
                </div>

                <div className="chart-container" style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)', height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '18px' }}>Expenses by Category</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
            </div>

            <div className="table-card" style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '18px' }}>Top Expenses</h3>
                <div className="table-container">
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
                            {transactions
                                .filter(t => t.type === 'expense')
                                .sort((a, b) => Number(b.amount) - Number(a.amount))
                                .slice(0, 5)
                                .map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '12px', fontWeight: 500 }}>{t.recipientName}</td>
                                        <td style={{ padding: '12px', color: '#6B7280' }}>{t.category}</td>
                                        <td style={{ padding: '12px', color: '#6B7280' }}>{new Date(t.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px', fontWeight: 600, textAlign: 'right' }}>-${Number(t.amount).toLocaleString()}</td>
                                    </tr>
                                ))}
                            {transactions.filter(t => t.type === 'expense').length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No expense data available yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
