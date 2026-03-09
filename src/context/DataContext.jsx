import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

function parseJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('JWT parse error:', e);
        return {};
    }
}

const sanitizeText = (text, maxLength = 200) => {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/<[^>]*>?/gm, '').trim().substring(0, maxLength);
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        user: {
            id: 'u1',
            name: 'User',
            monthlySpendingLimit: null,
            categoryBudget: {
                'Food & Grocery': 0,
                'Transport': 0,
                'Bills & Utilities': 0,
                'Entertainment': 0,
                'Healthcare': 0,
                'Others': 0
            },
            avatar: null
        },
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
                    const payload = parseJWT(token);
                    const metadata = payload.user_metadata || payload.raw_user_meta_data || {};
                    const fullName = metadata.full_name ||
                        metadata.name ||
                        (metadata.given_name ? `${metadata.given_name} ${metadata.family_name || ''}`.trim() : null) ||
                        payload.email?.split('@')[0] ||
                        'User';

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

    const addTransaction = (tx) => {
        const sanitizedTx = {
            ...tx,
            recipientName: sanitizeText(tx.recipientName, 100),
            notes: sanitizeText(tx.notes, 500),
            amount: Number(tx.amount)
        };
        setData(prev => ({
            ...prev,
            transactions: [
                { ...sanitizedTx, id: uuidv4(), date: new Date().toISOString() },
                ...prev.transactions
            ]
        }));
    };
    const deleteTransaction = (id) => setData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
    const editTransaction = (updatedTx) => setData(prev => ({ ...prev, transactions: prev.transactions.map(t => t.id === updatedTx.id ? { ...t, ...updatedTx } : t) }));
    const addCard = (card) => setData(prev => ({ ...prev, cards: [...prev.cards, { id: uuidv4(), ...card }] }));
    const deleteCard = (id) => setData(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== id) }));
    const addGoal = (goal) => {
        const sanitizedGoal = {
            ...goal,
            name: sanitizeText(goal.name, 100),
            targetAmount: Number(goal.targetAmount),
            currentAmount: Number(goal.currentAmount)
        };
        setData(prev => ({
            ...prev,
            goals: [...prev.goals, { ...sanitizedGoal, id: uuidv4() }]
        }));
    };
    const updateGoal = (updatedGoal) => {
        const sanitizedGoal = {
            ...updatedGoal,
            name: sanitizeText(updatedGoal.name, 100),
            targetAmount: Number(updatedGoal.targetAmount),
            currentAmount: Number(updatedGoal.currentAmount)
        };
        setData(prev => ({ ...prev, goals: prev.goals.map(g => g.id === sanitizedGoal.id ? sanitizedGoal : g) }));
    };
    const deleteGoal = (id) => setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
    const updateBudget = (category, amount) => setData(prev => ({ ...prev, budget: { ...prev.budget, [category]: Number(amount) } }));
    const updateUser = (u) => {
        const sanitizedName = u.name ? sanitizeText(u.name, 100) : data.user.name;
        const updatedUser = {
            ...data.user,
            ...u,
            name: sanitizedName,
            monthlySpendingLimit: u.monthlySpendingLimit === undefined ? data.user.monthlySpendingLimit : (u.monthlySpendingLimit === null ? null : Number(u.monthlySpendingLimit)),
            categoryBudget: u.categoryBudget || data.user.categoryBudget
        };
        setData(prev => ({ ...prev, user: updatedUser }));
    };
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
