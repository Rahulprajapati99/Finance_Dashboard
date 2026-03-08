"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// SSR-safe default prevents crash during Next.js prerendering
const defaultContextValue = {
    data: {
        user: { id: 'u1', name: 'Rahul P', monthlySpendingLimit: 5000, avatar: null },
        transactions: [],
        cards: [],
        goals: [],
        budget: { Investment: 0, Travelling: 0, 'Food & Grocery': 0, Entertainment: 0, Healthcare: 0, Others: 0 },
        notifications: []
    },
    isLoading: true,
    addTransaction: async () => { },
    deleteTransaction: async () => { },
    editTransaction: async () => { },
    addCard: () => { },
    deleteCard: () => { },
    addGoal: () => { },
    updateGoal: () => { },
    deleteGoal: () => { },
    updateBudget: () => { },
    updateUser: () => { },
    markNotificationRead: () => { },
    clearAllNotifications: () => { },
    resetData: () => { }
};

const DataContext = createContext(defaultContextValue);

export const useData = () => useContext(DataContext);

// Helper: use fetch directly instead of supabase-js to avoid init issues
async function supabaseFetch(path, options = {}) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...options.headers
        },
        ...options
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Supabase error ${res.status}: ${text}`);
    }
    return res.status === 204 ? null : res.json();
}

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(defaultContextValue.data);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Always resolve loading, even on error
        const init = async () => {
            // Load local data first (cards/goals/budget/user/notifications)
            const saved = localStorage.getItem('finance_db');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setData(prev => ({ ...prev, ...parsed }));
                } catch (e) { /* ignore */ }
            }

            // Try to load transactions from Supabase
            if (SUPABASE_URL && SUPABASE_KEY) {
                try {
                    const txData = await supabaseFetch('transactions?select=*&order=date.desc');
                    if (txData && txData.length > 0) {
                        setData(prev => ({ ...prev, transactions: txData }));
                    }
                } catch (err) {
                    console.warn('Supabase transactions fetch failed:', err.message);
                }
            }

            setIsLoading(false);
        };

        init();
    }, []);

    // Persist non-transaction data locally
    useEffect(() => {
        if (!isLoading) {
            const { transactions, ...rest } = data;
            localStorage.setItem('finance_db', JSON.stringify(rest));
        }
    }, [data, isLoading]);

    const addTransaction = async (tx) => {
        const newTx = { ...tx, id: uuidv4() };
        setData(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
        if (SUPABASE_URL && SUPABASE_KEY) {
            try {
                await supabaseFetch('transactions', {
                    method: 'POST',
                    body: JSON.stringify(newTx)
                });
            } catch (err) {
                console.error('Insert error:', err.message);
            }
        }
    };

    const deleteTransaction = async (id) => {
        setData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
        if (SUPABASE_URL && SUPABASE_KEY) {
            try {
                await supabaseFetch(`transactions?id=eq.${id}`, { method: 'DELETE' });
            } catch (err) { console.error('Delete error:', err.message); }
        }
    };

    const editTransaction = async (updatedTx) => {
        setData(prev => ({ ...prev, transactions: prev.transactions.map(t => t.id === updatedTx.id ? { ...t, ...updatedTx } : t) }));
        if (SUPABASE_URL && SUPABASE_KEY) {
            try {
                await supabaseFetch(`transactions?id=eq.${updatedTx.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(updatedTx)
                });
            } catch (err) { console.error('Update error:', err.message); }
        }
    };

    const addCard = (card) => setData(prev => ({ ...prev, cards: [...prev.cards, { id: uuidv4(), ...card }] }));
    const deleteCard = (id) => setData(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== id) }));
    const addGoal = (goal) => setData(prev => ({ ...prev, goals: [...prev.goals, { id: uuidv4(), ...goal }] }));
    const updateGoal = (g) => setData(prev => ({ ...prev, goals: prev.goals.map(x => x.id === g.id ? g : x) }));
    const deleteGoal = (id) => setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
    const updateBudget = (cat, amt) => setData(prev => ({ ...prev, budget: { ...prev.budget, [cat]: Number(amt) } }));
    const updateUser = (u) => setData(prev => ({ ...prev, user: { ...prev.user, ...u } }));
    const markNotificationRead = (id) => setData(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
    const clearAllNotifications = () => setData(prev => ({ ...prev, notifications: [] }));
    const resetData = () => { localStorage.removeItem('finance_db'); window.location.reload(); };

    return (
        <DataContext.Provider value={{
            data, isLoading,
            addTransaction, deleteTransaction, editTransaction,
            addCard, deleteCard,
            addGoal, updateGoal, deleteGoal,
            updateBudget, updateUser,
            markNotificationRead, clearAllNotifications, resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};
