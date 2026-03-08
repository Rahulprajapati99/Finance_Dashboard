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
            // Seed with sample data
            const initialData = {
                user: { id: 'u1', name: 'Rahul P', monthlySpendingLimit: 3000 },
                transactions: [
                    { id: uuidv4(), type: 'income', amount: 5000, category: 'Salary', recipientName: 'Tech Corp', status: 'completed', date: new Date().toISOString(), notes: 'Monthly Salary' },
                    { id: uuidv4(), type: 'expense', amount: 150, category: 'Food & Grocery', recipientName: 'Whole Foods', status: 'completed', date: new Date(Date.now() - 86400000).toISOString(), notes: 'Weekly groceries' },
                    { id: uuidv4(), type: 'expense', amount: 45, category: 'Transport', recipientName: 'Uber', status: 'completed', date: new Date(Date.now() - 172800000).toISOString(), notes: 'Ride home' },
                    { id: uuidv4(), type: 'expense', amount: 1200, category: 'Bills & Utilities', recipientName: 'Landlord', status: 'completed', date: new Date(Date.now() - 259200000).toISOString(), notes: 'Rent' },
                ],
                cards: [
                    { id: uuidv4(), cardNumber: '4532', cardHolder: 'RAHUL P', expiryDate: '12/25', cardType: 'visa', nickname: 'Primary' },
                    { id: uuidv4(), cardNumber: '8821', cardHolder: 'RAHUL P', expiryDate: '09/24', cardType: 'mastercard', nickname: 'Travel' }
                ],
                goals: [
                    { id: uuidv4(), name: 'Vacation', targetAmount: 2000, currentAmount: 850, targetDate: '2024-12-01' },
                    { id: uuidv4(), name: 'Emergency Fund', targetAmount: 10000, currentAmount: 3200, targetDate: '2025-01-01' }
                ],
                budget: {
                    Investment: 1000,
                    Travelling: 200,
                    'Food & Grocery': 600,
                    Entertainment: 200,
                    Healthcare: 100,
                    Others: 300
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
