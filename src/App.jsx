import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

// Placeholder components for routes not yet implemented
const WalletPlaceholder = () => <div style={{ padding: '2rem' }}><h2>My Wallet</h2><p>Manage your cards here.</p></div>;
const GoalsPlaceholder = () => <div style={{ padding: '2rem' }}><h2>Savings Goals</h2><p>Track your financial goals.</p></div>;
const AnalyticsPlaceholder = () => <div style={{ padding: '2rem' }}><h2>Analytics</h2><p>Detailed financial breakdown.</p></div>;
const ReportsPlaceholder = () => <div style={{ padding: '2rem' }}><h2>Reports</h2><p>Export and view statements.</p></div>;

function App() {
    return (
        <DataProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="goals" element={<Goals />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </DataProvider>
    );
}

export default App;
