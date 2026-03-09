import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const DataContext = createContext();

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

            if (SUPABASE_URL && SUPABASE_KEY && token) {
                try {
                    const payload = parseJWT(token);
                    const userId = payload.sub;
                    const metadata = payload.user_metadata || payload.raw_user_meta_data || {};
                    const fullName = metadata.full_name || metadata.name || payload.email?.split('@')[0] || 'User';

                    const txPromise = supabaseFetch('transactions?select=*&order=date.desc', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const goalsPromise = supabaseFetch('goals?select=*&order=created_at.asc', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const profilePromise = supabaseFetch(`profiles?id=eq.${userId}&select=*`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    const [txData, goalsData, profileData] = await Promise.all([txPromise, goalsPromise, profilePromise]);

                    let userProfile = profileData && profileData.length > 0 ? profileData[0] : null;

                    setData(prev => ({
                        ...prev,
                        user: {
                            id: userId,
                            name: userProfile?.name || fullName,
                            monthlySpendingLimit: userProfile?.monthly_spending_limit || null,
                            categoryBudget: userProfile?.category_budget || prev.user.categoryBudget,
                            avatar: metadata.avatar_url || null
                        },
                        transactions: txData || [],
                        goals: (goalsData || []).map(g => ({
                            id: g.id,
                            name: g.name,
                            targetAmount: g.target_amount,
                            currentAmount: g.current_amount,
                            targetDate: g.target_date
                        }))
                    }));
                } catch (e) { console.error('Supabase init failed:', e); }
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

    const addTransaction = async (tx) => {
        const token = localStorage.getItem('sb-token');
        const sanitizedTx = {
            ...tx,
            recipientName: sanitizeText(tx.recipientName, 100),
            notes: sanitizeText(tx.notes, 500),
            amount: Number(tx.amount),
            id: uuidv4(),
            date: new Date().toISOString()
        };

        setData(prev => ({
            ...prev,
            transactions: [sanitizedTx, ...prev.transactions]
        }));

        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                await supabaseFetch('transactions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ ...sanitizedTx, user_id: data.user.id })
                });
            } catch (err) { console.error('Save transaction failed:', err); }
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
            } catch (err) { console.error('Delete transaction failed:', err); }
        }
    };

    const addGoal = async (goal) => {
        const token = localStorage.getItem('sb-token');
        const newGoal = {
            ...goal,
            id: uuidv4(),
            name: sanitizeText(goal.name, 100),
            targetAmount: Number(goal.targetAmount),
            currentAmount: Number(goal.currentAmount || 0)
        };

        setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));

        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                await supabaseFetch('goals', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        id: newGoal.id,
                        user_id: data.user.id,
                        name: newGoal.name,
                        target_amount: newGoal.targetAmount,
                        current_amount: newGoal.currentAmount,
                        target_date: newGoal.targetDate
                    })
                });
            } catch (err) { console.error('Save goal failed:', err); }
        }
    };

    const updateGoal = async (updatedGoal) => {
        const token = localStorage.getItem('sb-token');
        const sanitizedGoal = {
            ...updatedGoal,
            name: sanitizeText(updatedGoal.name, 100),
            targetAmount: Number(updatedGoal.targetAmount),
            currentAmount: Number(updatedGoal.currentAmount)
        };

        setData(prev => ({
            ...prev,
            goals: prev.goals.map(g => g.id === sanitizedGoal.id ? sanitizedGoal : g)
        }));

        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
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
            } catch (err) { console.error('Update goal failed:', err); }
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
            } catch (err) { console.error('Delete goal failed:', err); }
        }
    };

    const updateUser = async (u) => {
        const token = localStorage.getItem('sb-token');
        const updatedUser = {
            ...data.user,
            ...u,
            name: u.name ? sanitizeText(u.name, 100) : data.user.name,
            monthlySpendingLimit: u.monthlySpendingLimit === undefined ? data.user.monthlySpendingLimit : (u.monthlySpendingLimit === null ? null : Number(u.monthlySpendingLimit)),
            categoryBudget: u.categoryBudget || data.user.categoryBudget
        };

        setData(prev => ({ ...prev, user: updatedUser }));

        if (SUPABASE_URL && SUPABASE_KEY && token) {
            try {
                const payload = parseJWT(token);
                const currentUserId = payload.sub || data.user.id;
                await supabaseFetch(`profiles?id=eq.${currentUserId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        name: updatedUser.name,
                        monthly_spending_limit: updatedUser.monthlySpendingLimit,
                        category_budget: updatedUser.categoryBudget
                    })
                });
            } catch (err) { console.error('Update profile failed:', err); }
        }
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

    const totalIncome = data.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalExpense = data.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalSavings = totalIncome - totalExpense;

    return (
        <DataContext.Provider value={{
            data, isLoading,
            addTransaction, deleteTransaction,
            addGoal, updateGoal, deleteGoal,
            updateUser, resetData, logout,
            totalIncome, totalExpense, totalSavings
        }}>
            {children}
        </DataContext.Provider>
    );
};
