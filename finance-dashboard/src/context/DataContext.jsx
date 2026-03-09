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
        goals: [],
        budget: { Investment: 0, Travelling: 0, 'Food & Grocery': 0, Entertainment: 0, Healthcare: 0, Others: 0 },
        notifications: []
    },
    isLoading: true,
    addTransaction: async () => { },
    deleteTransaction: async () => { },
    editTransaction: async () => { },
    addGoal: async () => { },
    updateGoal: async () => { },
    deleteGoal: async () => { },
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
    const { headers: customHeaders, ...restOptions } = options;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...customHeaders
        },
        ...restOptions
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

    // Always resolve loading, even on error
    const init = async () => {
        // Handle OAuth redirect fragment (#access_token=...)
        const hash = window.location.hash;
        if (hash && hash.includes('access_token=')) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get('access_token');
            if (token) {
                localStorage.setItem('sb-token', token);
                document.cookie = `sb-token=${token}; path=/; max-age=3600; SameSite=Lax`;
                // Clear the hash for a clean URL
                window.history.replaceState(null, null, window.location.pathname);

                // Next.js middleware redirects back to /login when token is in hash
                // Once we save the token, we need to manually redirect to the dashboard
                if (window.location.pathname === '/login') {
                    window.location.href = '/';
                    return;
                }
            }
        }

        const token = localStorage.getItem('sb-token');

        // Load local data first (budget/user/notifications)
        const saved = localStorage.getItem('finance_db');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure we don't overwrite transactions or goals with empty defaults from local storage if they are missing
                setData(prev => ({ ...prev, ...parsed, transactions: prev.transactions, goals: prev.goals }));
            } catch (e) { /* ignore */ }
        }

        // Try to load transactions and goals from Supabase with user token
        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                // Fetch transactions
                const txPromise = supabaseFetch('transactions?select=*&order=date.desc', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Fetch goals
                const goalsPromise = supabaseFetch('goals?select=*&order=created_at.asc', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const [txData, goalsData] = await Promise.all([txPromise, goalsPromise]);

                setData(prev => ({
                    ...prev,
                    transactions: txData || prev.transactions,
                    // Map snake_case from DB to camelCase for frontend
                    goals: (goalsData || []).map(g => ({
                        id: g.id,
                        name: g.name,
                        targetAmount: Number(g.target_amount),
                        currentAmount: Number(g.current_amount),
                        targetDate: g.target_date
                    }))
                }));
            } catch (err) {
                console.warn('Supabase fetch failed:', err.message);
                if (err.message.includes('401')) logout();
            }
        }

        setIsLoading(false);
    };

    const logout = () => {
        localStorage.removeItem('sb-token');
        document.cookie = "sb-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = '/login';
    };

    useEffect(() => {
        init();
    }, []);

    // Persist non-transaction/non-goal data locally
    useEffect(() => {
        if (!isLoading) {
            const { transactions, goals, ...rest } = data;
            localStorage.setItem('finance_db', JSON.stringify(rest));
        }
    }, [data, isLoading]);

    const addTransaction = async (tx) => {
        const token = localStorage.getItem('sb-token');
        const newTx = { ...tx, id: uuidv4() };
        setData(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                await supabaseFetch('transactions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(newTx)
                });
            } catch (err) {
                console.error('Insert error:', err.message);
            }
        }
    };

    const deleteTransaction = async (id) => {
        const token = localStorage.getItem('sb-token');
        setData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                await supabaseFetch(`transactions?id=eq.${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (err) { console.error('Delete error:', err.message); }
        }
    };

    const editTransaction = async (updatedTx) => {
        const token = localStorage.getItem('sb-token');
        setData(prev => ({ ...prev, transactions: prev.transactions.map(t => t.id === updatedTx.id ? { ...t, ...updatedTx } : t) }));
        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                await supabaseFetch(`transactions?id=eq.${updatedTx.id}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(updatedTx)
                });
            } catch (err) { console.error('Update error:', err.message); }
        }
    };

    const addGoal = async (goal) => {
        const token = localStorage.getItem('sb-token');
        const newGoal = { ...goal, id: uuidv4() };
        setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));

        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                await supabaseFetch('goals', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        id: newGoal.id,
                        name: newGoal.name,
                        target_amount: newGoal.targetAmount,
                        current_amount: newGoal.currentAmount || 0,
                        target_date: newGoal.targetDate
                    })
                });
            } catch (err) { console.error('Insert goal error:', err.message); }
        }
    };

    const updateGoal = async (g) => {
        const token = localStorage.getItem('sb-token');
        setData(prev => ({ ...prev, goals: prev.goals.map(x => x.id === g.id ? g : x) }));

        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                await supabaseFetch(`goals?id=eq.${g.id}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        name: g.name,
                        target_amount: g.targetAmount,
                        current_amount: g.currentAmount,
                        target_date: g.targetDate
                    })
                });
            } catch (err) { console.error('Update goal error:', err.message); }
        }
    };

    const deleteGoal = async (id) => {
        const token = localStorage.getItem('sb-token');
        setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                await supabaseFetch(`goals?id=eq.${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (err) { console.error('Delete goal error:', err.message); }
        }
    };
    const updateBudget = (cat, amt) => setData(prev => ({ ...prev, budget: { ...prev.budget, [cat]: Number(amt) } }));
    const updateUser = (u) => setData(prev => ({ ...prev, user: { ...prev.user, ...u } }));
    const markNotificationRead = (id) => setData(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
    const clearAllNotifications = () => setData(prev => ({ ...prev, notifications: [] }));
    const resetData = () => { localStorage.removeItem('finance_db'); window.location.reload(); };

    return (
        <DataContext.Provider value={{
            data, isLoading,
            addTransaction, deleteTransaction, editTransaction,
            addGoal, updateGoal, deleteGoal,
            updateBudget, updateUser,
            markNotificationRead, clearAllNotifications, resetData,
            logout
        }}>
            {children}
        </DataContext.Provider>
    );
};
