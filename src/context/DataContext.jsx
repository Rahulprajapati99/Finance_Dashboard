import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        user: { id: 'u1', name: 'User', monthlySpendingLimit: 5000, avatar: null },
        transactions: [],
        cards: [],
        goals: [],
        budget: { Investment: 0, Travelling: 0, 'Food & Grocery': 0, Entertainment: 0, Healthcare: 0, Others: 0 },
        notifications: []
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('sb-token');
            const saved = localStorage.getItem('finance_db');

            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setData(prev => ({ ...prev, ...parsed }));
                } catch (e) { /* ignore */ }
            }

            if (token) {
                try {
                    // Extract name from token (same logic as Next.js version)
                    const payloadStr = token.split('.')[1];
                    const payload = JSON.parse(atob(payloadStr));
                    const metadata = payload.user_metadata || {};
                    const fullName = metadata.full_name || metadata.name || 'User';

                    setData(prev => ({
                        ...prev,
                        user: {
                            ...prev.user,
                            id: payload.sub,
                            name: fullName,
                            avatar: metadata.avatar_url || null
                        }
                    }));
                } catch (e) { console.error('Token parse failed:', e); }
            }
            setIsLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('finance_db', JSON.stringify(data));
        }
    }, [data, isLoading]);

    const addTransaction = (tx) => setData(prev => ({ ...prev, transactions: [{ id: uuidv4(), date: new Date().toISOString(), ...tx }, ...prev.transactions] }));
    const deleteTransaction = (id) => setData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
    const editTransaction = (updatedTx) => setData(prev => ({ ...prev, transactions: prev.transactions.map(t => t.id === updatedTx.id ? { ...t, ...updatedTx } : t) }));
    const addCard = (card) => setData(prev => ({ ...prev, cards: [...prev.cards, { id: uuidv4(), ...card }] }));
    const deleteCard = (id) => setData(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== id) }));
    const addGoal = (goal) => setData(prev => ({ ...prev, goals: [...prev.goals, { id: uuidv4(), ...goal }] }));
    const updateGoal = (updatedGoal) => setData(prev => ({ ...prev, goals: prev.goals.map(g => g.id === updatedGoal.id ? updatedGoal : g) }));
    const deleteGoal = (id) => setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
    const updateBudget = (category, amount) => setData(prev => ({ ...prev, budget: { ...prev.budget, [category]: Number(amount) } }));
    const updateUser = (userData) => setData(prev => ({ ...prev, user: { ...prev.user, ...userData } }));
    const markNotificationRead = (id) => setData(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
    const clearAllNotifications = () => setData(prev => ({ ...prev, notifications: [] }));
    const resetData = () => { localStorage.removeItem('finance_db'); localStorage.removeItem('sb-token'); window.location.reload(); };
    const logout = () => {
        localStorage.removeItem('sb-token');
        localStorage.removeItem('finance_db');
        document.cookie = "sb-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = '/login';
    };

    // Computed Values
    const totalIncome = data.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalExpense = data.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalSavings = totalIncome - totalExpense;

    return (
        <DataContext.Provider value={{
            data, isLoading,
            addTransaction, deleteTransaction, editTransaction,
            addCard, deleteCard,
            addGoal, updateGoal, deleteGoal,
            updateBudget, updateUser,
            markNotificationRead, clearAllNotifications, resetData, logout,
            totalIncome, totalExpense, totalSavings
        }}>
            {children}
        </DataContext.Provider>
    );
};
