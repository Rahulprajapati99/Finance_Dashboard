"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// SSR-safe default prevents crash during Next.js prerendering
const defaultContextValue = {
    data: {
        user: { id: 'u1', name: 'User', monthlySpendingLimit: null, avatar: null },
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
    resetData: () => { },
    logout: () => { },
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0
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

        // Try to load transactions, goals, and profile from Supabase with user token
        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                // Decode token to get user metadata (name/email)
                const payload = parseJWT(token);
                const userId = payload.sub;
                const metadata = payload.user_metadata || payload.raw_user_meta_data || {};
                const fullName = metadata.full_name ||
                    metadata.name ||
                    (metadata.given_name ? `${metadata.given_name} ${metadata.family_name || ''}`.trim() : null) ||
                    payload.email?.split('@')[0] ||
                    'User';

                // Fetch transactions
                const txPromise = supabaseFetch('transactions?select=*&order=date.desc', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Fetch goals
                const goalsPromise = supabaseFetch('goals?select=*&order=created_at.asc', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Fetch profile
                const profilePromise = supabaseFetch(`profiles?id=eq.${userId}&select=*`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const [txData, goalsData, profileData] = await Promise.all([txPromise, goalsPromise, profilePromise]);

                let userProfile = profileData && profileData.length > 0 ? profileData[0] : null;

                // Create profile if it doesn't exist
                if (!userProfile) {
                    try {
                        userProfile = await supabaseFetch('profiles', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({
                                id: userId,
                                name: fullName,
                                monthly_spending_limit: 5000
                            })
                        });
                        // Supabase representation returns an array usually
                        if (Array.isArray(userProfile)) userProfile = userProfile[0];
                    } catch (e) { console.error('Profile creation failed:', e); }
                }

                setData(prev => ({
                    ...prev,
                    user: {
                        id: userId,
                        name: userProfile?.name || fullName,
                        monthlySpendingLimit: userProfile?.monthly_spending_limit || null,
                        categoryBudgets: userProfile?.category_budgets || {
                            'Food & Grocery': 0,
                            'Transport': 0,
                            'Bills & Utilities': 0,
                            'Entertainment': 0,
                            'Healthcare': 0,
                            'Others': 0
                        },
                        avatar: metadata.avatar_url || null
                    },
                    transactions: (txData || []).map(t => ({
                        ...t,
                        date: t.date || t.created_at
                    })),
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
        localStorage.removeItem('finance_db');
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
        try {
            const sanitizedTx = {
                ...tx,
                recipientName: tx.recipientName ? sanitizeText(tx.recipientName, 100) : '',
                notes: tx.notes ? sanitizeText(tx.notes, 500) : '',
                date: tx.date || new Date().toISOString()
            };
            const newTx = { ...sanitizedTx, id: uuidv4() };
            setData(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
            if (SUPABASE_URL && SUPABASE_KEY && token) {
                await supabaseFetch('transactions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(newTx)
                });
            }
        } catch (err) {
            console.error('Add transaction error:', err.message);
            // Optionally revert local state or show user feedback
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
        try {
            const sanitizedTx = {
                ...updatedTx,
                recipientName: updatedTx.recipientName ? sanitizeText(updatedTx.recipientName, 100) : '',
                notes: updatedTx.notes ? sanitizeText(updatedTx.notes, 500) : ''
            };
            setData(prev => ({ ...prev, transactions: prev.transactions.map(t => t.id === sanitizedTx.id ? { ...t, ...sanitizedTx } : t) }));
            if (SUPABASE_URL && SUPABASE_KEY && token) {
                await supabaseFetch(`transactions?id=eq.${sanitizedTx.id}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(sanitizedTx)
                });
            }
        } catch (err) {
            console.error('Update transaction error:', err.message);
            // Optionally revert local state or show user feedback
        }
    };

    const addGoal = async (goal) => {
        const token = localStorage.getItem('sb-token');
        try {
            const sanitizedGoal = {
                ...goal,
                name: sanitizeText(goal.name, 100)
            };
            const newGoal = { ...sanitizedGoal, id: uuidv4() };
            setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));

            if (SUPABASE_URL && SUPABASE_KEY && token) {
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
            }
        } catch (err) {
            console.error('Insert goal error:', err.message);
            // Optionally revert local state or show user feedback
        }
    };

    const updateGoal = async (g) => {
        const token = localStorage.getItem('sb-token');
        try {
            const sanitizedGoal = {
                ...g,
                name: sanitizeText(g.name, 100)
            };
            setData(prev => ({ ...prev, goals: prev.goals.map(x => x.id === sanitizedGoal.id ? sanitizedGoal : x) }));

            if (SUPABASE_URL && SUPABASE_KEY && token) {
                await supabaseFetch(`goals?id=eq.${sanitizedGoal.id}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        name: sanitizedGoal.name,
                        target_amount: sanitizedGoal.targetAmount,
                        current_amount: sanitizedGoal.currentAmount,
                        target_date: sanitizedGoal.targetDate
                    })
                });
            }
        } catch (err) {
            console.error('Update goal error:', err.message);
            // Optionally revert local state or show user feedback
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
    const updateUser = async (u) => {
        const token = localStorage.getItem('sb-token');
        try {
            const sanitizedName = u.name ? sanitizeText(u.name, 50) : data.user.name;
            const updatedUser = {
                ...data.user,
                ...u,
                name: sanitizedName,
                monthlySpendingLimit: u.monthlySpendingLimit === undefined ? data.user.monthlySpendingLimit : (u.monthlySpendingLimit === null ? null : Number(u.monthlySpendingLimit)),
                categoryBudgets: u.categoryBudgets || data.user.categoryBudgets
            };
            setData(prev => ({ ...prev, user: updatedUser }));

            if (SUPABASE_URL && SUPABASE_KEY && token) {
                await supabaseFetch(`profiles?id=eq.${data.user.id}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        name: updatedUser.name,
                        monthly_spending_limit: updatedUser.monthlySpendingLimit,
                        avatar_url: updatedUser.avatar,
                        category_budgets: updatedUser.categoryBudgets
                    })
                });
            }
        } catch (err) {
            console.error('Update profile error:', err.message);
            // Optionally revert local state or show user feedback
        }
    };
    const markNotificationRead = (id) => setData(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
    const clearAllNotifications = () => setData(prev => ({ ...prev, notifications: [] }));
    const resetData = () => { localStorage.removeItem('finance_db'); localStorage.removeItem('sb-token'); window.location.reload(); };


    // Computed Values
    const totalIncome = data.transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const totalExpense = data.transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const totalSavings = totalIncome - totalExpense;

    return (
        <DataContext.Provider value={{
            data, isLoading,
            addTransaction, deleteTransaction, editTransaction,
            addGoal, updateGoal, deleteGoal,
            updateBudget, updateUser,
            markNotificationRead, clearAllNotifications, resetData,
            logout,
            totalIncome, totalExpense, totalSavings
        }}>
            {children}
        </DataContext.Provider>
    );
};
