import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        user: {
            id: 'u1',
            name: 'John Doe',
            monthlySpendingLimit: 3000,
            avatar: null
        },
        transactions: [],
        cards: [],
        goals: [],
        budget: {
            Investment: 0,
            Travelling: 0,
            'Food & Grocery': 0,
            Entertainment: 0,
            Healthcare: 0,
            Others: 0
        },
        notifications: [
            { id: 1, title: 'Welcome!', message: 'Thanks for using RP Solutionss Dashboard.', type: 'info', read: false, date: new Date().toISOString() },
            { id: 2, title: 'Budget Alert', message: 'You have used 80% of your Food budget.', type: 'warning', read: false, date: new Date().toISOString() }
        ]
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('finance_db');
        if (saved) {
            try {
                const parsedData = JSON.parse(saved);
                // Auto-update user name if it's the default
                if (parsedData.user && parsedData.user.name === 'John Doe') {
                    parsedData.user.name = 'Rahul P';
                }
                setData(parsedData);
            } catch (e) {
                console.error("Failed to load data", e);
                // Fallback to initial data if parse fails
                const initialData = {
                    user: { id: 'u1', name: 'Rahul P', monthlySpendingLimit: 3000 },
                    transactions: [],
                    cards: [],
                    goals: [],
                    budget: {}
                };
                setData(initialData);
            }
        } else {
            // Seed with more realistic sample data over multiple months
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            // Helper to generate dates in previous months
            const getDateInMonth = (monthsAgo, day = 15) => {
                const d = new Date(currentYear, currentMonth - monthsAgo, day);
                return d.toISOString();
            };

            const initialData = {
                user: { id: 'u1', name: 'Rahul P', monthlySpendingLimit: 5000 },
                transactions: [
                    // Current Month
                    { id: uuidv4(), type: 'income', amount: 6500, category: 'Salary', recipientName: 'Tech Corp', status: 'completed', date: getDateInMonth(0, 1), notes: 'Monthly Salary' },
                    { id: uuidv4(), type: 'expense', amount: 150, category: 'Food & Grocery', recipientName: 'Whole Foods', status: 'completed', date: new Date(Date.now() - 86400000).toISOString(), notes: 'Weekly groceries' },
                    { id: uuidv4(), type: 'expense', amount: 45, category: 'Transport', recipientName: 'Uber', status: 'completed', date: new Date(Date.now() - 172800000).toISOString(), notes: 'Ride home' },
                    { id: uuidv4(), type: 'expense', amount: 1800, category: 'Bills & Utilities', recipientName: 'Landlord', status: 'completed', date: getDateInMonth(0, 1), notes: 'Rent' },
                    { id: uuidv4(), type: 'expense', amount: 200, category: 'Entertainment', recipientName: 'Netflix & Spotify', status: 'completed', date: getDateInMonth(0, 5), notes: 'Subscriptions' },

                    // 1 Month Ago
                    { id: uuidv4(), type: 'income', amount: 6500, category: 'Salary', recipientName: 'Tech Corp', status: 'completed', date: getDateInMonth(1, 1), notes: 'Monthly Salary' },
                    { id: uuidv4(), type: 'income', amount: 500, category: 'Freelance', recipientName: 'Design Client', status: 'completed', date: getDateInMonth(1, 15), notes: 'Logo design' },
                    { id: uuidv4(), type: 'expense', amount: 1800, category: 'Bills & Utilities', recipientName: 'Landlord', status: 'completed', date: getDateInMonth(1, 1), notes: 'Rent' },
                    { id: uuidv4(), type: 'expense', amount: 450, category: 'Food & Grocery', recipientName: 'Trader Joes', status: 'completed', date: getDateInMonth(1, 10), notes: 'Groceries' },
                    { id: uuidv4(), type: 'expense', amount: 120, category: 'Transport', recipientName: 'Gas Station', status: 'completed', date: getDateInMonth(1, 12), notes: 'Fuel' },
                    { id: uuidv4(), type: 'expense', amount: 85, category: 'Healthcare', recipientName: 'Pharmacy', status: 'completed', date: getDateInMonth(1, 20), notes: 'Meds' },

                    // 2 Months Ago
                    { id: uuidv4(), type: 'income', amount: 6500, category: 'Salary', recipientName: 'Tech Corp', status: 'completed', date: getDateInMonth(2, 1), notes: 'Monthly Salary' },
                    { id: uuidv4(), type: 'expense', amount: 1800, category: 'Bills & Utilities', recipientName: 'Landlord', status: 'completed', date: getDateInMonth(2, 1), notes: 'Rent' },
                    { id: uuidv4(), type: 'expense', amount: 380, category: 'Food & Grocery', recipientName: 'Whole Foods', status: 'completed', date: getDateInMonth(2, 8), notes: 'Groceries' },
                    { id: uuidv4(), type: 'expense', amount: 600, category: 'Travelling', recipientName: 'Delta Airlines', status: 'completed', date: getDateInMonth(2, 15), notes: 'Flights for vacation' },
                    { id: uuidv4(), type: 'expense', amount: 80, category: 'Entertainment', recipientName: 'AMC Theaters', status: 'completed', date: getDateInMonth(2, 22), notes: 'Movie night' },

                    // 3 Months Ago
                    { id: uuidv4(), type: 'income', amount: 6500, category: 'Salary', recipientName: 'Tech Corp', status: 'completed', date: getDateInMonth(3, 1), notes: 'Monthly Salary' },
                    { id: uuidv4(), type: 'income', amount: 1200, category: 'Investment', recipientName: 'Stock Dividend', status: 'completed', date: getDateInMonth(3, 10), notes: 'Quarterly payout' },
                    { id: uuidv4(), type: 'expense', amount: 1800, category: 'Bills & Utilities', recipientName: 'Landlord', status: 'completed', date: getDateInMonth(3, 1), notes: 'Rent' },
                    { id: uuidv4(), type: 'expense', amount: 420, category: 'Food & Grocery', recipientName: 'Local Market', status: 'completed', date: getDateInMonth(3, 14), notes: 'Farmers market' },
                    { id: uuidv4(), type: 'expense', amount: 250, category: 'Shopping', recipientName: 'Amazon', status: 'completed', date: getDateInMonth(3, 20), notes: 'Electronics' },
                ],
                cards: [
                    { id: uuidv4(), cardNumber: '4532', cardHolder: 'RAHUL P', expiryDate: '12/25', cardType: 'visa', nickname: 'Primary Checking' },
                    { id: uuidv4(), cardNumber: '8821', cardHolder: 'RAHUL P', expiryDate: '09/24', cardType: 'mastercard', nickname: 'Travel Rewards' },
                    { id: uuidv4(), cardNumber: '3711', cardHolder: 'RAHUL P', expiryDate: '11/26', cardType: 'amex', nickname: 'Business Expenses' }
                ],
                goals: [
                    { id: uuidv4(), name: 'Japan Vacation', targetAmount: 5000, currentAmount: 2850, targetDate: '2024-11-01' },
                    { id: uuidv4(), name: 'Emergency Fund', targetAmount: 15000, currentAmount: 8200, targetDate: '2025-06-01' },
                    { id: uuidv4(), name: 'New Laptop', targetAmount: 2500, currentAmount: 2500, targetDate: '2024-05-01' } // Completed goal
                ],
                budget: {
                    Investment: 1200,
                    Travelling: 400,
                    'Food & Grocery': 800,
                    Entertainment: 300,
                    Healthcare: 150,
                    Others: 400
                }
            };
            setData(initialData);
            localStorage.setItem('finance_db', JSON.stringify(initialData));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('finance_db', JSON.stringify(data));
        }
    }, [data, isLoading]);

    const addTransaction = (tx) => {
        setData(prev => ({
            ...prev,
            transactions: [{ id: uuidv4(), createdAt: new Date().toISOString(), ...tx }, ...prev.transactions]
        }));
    };

    const deleteTransaction = (id) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.filter(t => t.id !== id)
        }));
    };

    const editTransaction = (updatedTx) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.map(t => t.id === updatedTx.id ? { ...t, ...updatedTx } : t)
        }));
    };

    const addCard = (card) => {
        setData(prev => ({ ...prev, cards: [...prev.cards, { id: uuidv4(), ...card }] }));
    };

    const deleteCard = (id) => {
        setData(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== id) }));
    };

    const addGoal = (goal) => {
        setData(prev => ({ ...prev, goals: [...prev.goals, { id: uuidv4(), ...goal }] }));
    };

    const updateGoal = (updatedGoal) => {
        setData(prev => ({ ...prev, goals: prev.goals.map(g => g.id === updatedGoal.id ? updatedGoal : g) }));
    };

    const deleteGoal = (id) => {
        setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
    };

    const updateBudget = (category, amount) => {
        setData(prev => ({
            ...prev,
            budget: { ...prev.budget, [category]: Number(amount) }
        }));
    };

    const updateUser = (userData) => {
        setData(prev => ({ ...prev, user: { ...prev.user, ...userData } }));
    };

    const markNotificationRead = (id) => {
        setData(prev => ({
            ...prev,
            notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }));
    };

    const clearAllNotifications = () => {
        setData(prev => ({ ...prev, notifications: [] }));
    };

    const resetData = () => {
        localStorage.removeItem('finance_db');
        window.location.reload();
    };

    return (
        <DataContext.Provider value={{
            data,
            isLoading,
            addTransaction,
            deleteTransaction,
            editTransaction,
            addCard,
            deleteCard,
            addGoal,
            updateGoal,
            deleteGoal,
            updateBudget,
            updateGoal,
            deleteGoal,
            updateBudget,
            updateUser,
            markNotificationRead,
            clearAllNotifications,
            resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};
