import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Plus, TrendingUp } from 'lucide-react';
import AddTransactionModal from '../components/AddTransactionModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MetricCard = ({ title, amount, icon: Icon, trend, type }) => (
    <div style={{
        backgroundColor: 'var(--color-white)',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '140px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={{ color: 'var(--color-text-body)', fontSize: '14px', marginBottom: '4px' }}>{title}</p>
                <h3 style={{ fontSize: '24px', fontWeight: 700 }}>${amount.toLocaleString()}</h3>
            </div>
            <div style={{
                backgroundColor: type === 'income' ? '#E8F5E9' : type === 'expense' ? '#FFEBEE' : '#E3F2FD',
                padding: '10px',
                borderRadius: '50%'
            }}>
                <Icon size={24} color={type === 'income' ? '#2E7D32' : type === 'expense' ? '#C62828' : '#1565C0'} />
            </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
            <span style={{
                color: trend >= 0 ? '#2E7D32' : '#C62828',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600
            }}>
                {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(trend)}%
            </span>
            <span style={{ marginLeft: '6px', color: '#9CA3AF' }}>vs last month</span>
        </div>
    </div>
);

const Dashboard = () => {
    const { data, isLoading, totalIncome, totalExpense, totalSavings } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading || !data) return <div style={{ padding: '2rem' }}>Loading...</div>;

    const { transactions, user } = data;
    const budget = user?.categoryBudgets || {};

    // Calculate current month expenses
    const now = new Date();
    const currentMonthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });

    const currentMonthExpense = currentMonthTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

    const spendingLimit = user?.monthlySpendingLimit || 0;
    const budgetUsagePercent = spendingLimit > 0 ? Math.min((currentMonthExpense / spendingLimit) * 100, 100) : 0;
    const isOverLimit = spendingLimit > 0 && currentMonthExpense > spendingLimit;

    const totalBalance = totalIncome - totalExpense;

    // Chart Data Preparation
    const incomeData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Income',
                data: [3000, 3200, 4500, 4200, 4800, totalIncome > 0 ? totalIncome : 5000], // Mock history + current
                backgroundColor: '#2E3A8C',
                borderRadius: 4,
            }
        ],
    };

    const budgetLabels = Object.keys(budget).filter(cat => budget[cat] > 0);
    const budgetValues = Object.values(budget).filter(v => v > 0);
    const hasBudget = budgetValues.length > 0;

    const budgetData = {
        labels: budgetLabels,
        datasets: [
            {
                data: budgetValues,
                backgroundColor: ['#2E3A8C', '#4A5FD9', '#FF9800', '#4CAF50', '#E91E63', '#9C27B0'],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#F3F4F6' } },
            x: { grid: { display: false } }
        }
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '24px' }}>Overview</h2>
                    <p style={{ color: 'var(--color-text-body)' }}>Hi {data.user.name}, here's your financial summary.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}
                    >
                        <Plus size={18} />
                        Add Transaction
                    </button>
                </div>
            </div>

            <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <MetricCard title="Total Balance" amount={totalBalance} icon={Wallet} trend={12.5} type="neutral" />
                <MetricCard title="Total Income" amount={totalIncome} icon={ArrowDownRight} trend={8.2} type="income" />
                <MetricCard title="Total Expense" amount={totalExpense} icon={ArrowUpRight} trend={-2.4} type="expense" />
                <div style={{ position: 'relative' }}>
                    <MetricCard title="Total Savings" amount={totalSavings} icon={PiggyBank} trend={5.3} type="neutral" />
                    {totalSavings > (data.goals.reduce((acc, g) => acc + g.targetAmount, 0)) && (
                        <div style={{
                            position: 'absolute',
                            bottom: '-25px',
                            left: '1.5rem',
                            fontSize: '11px',
                            color: '#059669',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <TrendingUp size={12} />
                            ${(totalSavings - data.goals.reduce((acc, g) => acc + g.targetAmount, 0)).toLocaleString()} Extra Surplus
                        </div>
                    )}
                </div>
            </div>

            {/* Budget Health Section */}
            <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '2rem',
                border: isOverLimit ? '1px solid #EF4444' : '1px solid transparent'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Monthly Budget Health</h4>
                        {spendingLimit > 0 ? (
                            <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--color-text-body)' }}>
                                You've spent <strong>${currentMonthExpense.toLocaleString()}</strong> of your <strong>${spendingLimit.toLocaleString()}</strong> limit for {now.toLocaleString('default', { month: 'long' })}.
                            </p>
                        ) : (
                            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#9CA3AF' }}>
                                Set a monthly spending limit in <a href="/settings" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Settings</a> to track your budget health.
                            </p>
                        )}
                    </div>
                    {isOverLimit && (
                        <span style={{
                            backgroundColor: '#FEE2E2',
                            color: '#B91C1C',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600
                        }}>
                            Limit Exceeded!
                        </span>
                    )}
                </div>
                {spendingLimit > 0 && (
                    <div style={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '5px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${budgetUsagePercent}%`,
                            height: '100%',
                            backgroundColor: isOverLimit ? '#EF4444' : budgetUsagePercent > 80 ? '#F59E0B' : '#2E3A8C',
                            transition: 'width 0.5s ease-in-out'
                        }} />
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)', height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '18px' }}>Total Income</h3>
                    <div style={{ height: '300px' }}>
                        <Bar data={incomeData} options={chartOptions} />
                    </div>
                </div>
                <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)', height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '18px' }}>Category Budget</h3>
                    <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                        {hasBudget ? (
                            <Doughnut data={budgetData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }} />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--color-text-body)' }}>
                                <p style={{ fontSize: '14px', marginBottom: '1rem' }}>No budget set for your categories yet.</p>
                                <Link to="/settings" style={{ color: 'var(--color-primary)', fontSize: '14px', textDecoration: 'underline' }}>
                                    Configure Budget in Settings
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
