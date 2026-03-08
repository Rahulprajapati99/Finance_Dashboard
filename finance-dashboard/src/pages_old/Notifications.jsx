import React from 'react';
import { useData } from '../context/DataContext';
import { Bell, Check, Trash2, Info, AlertTriangle } from 'lucide-react';

const Notifications = () => {
    const { data, markNotificationRead, clearAllNotifications } = useData();
    const { notifications } = data;

    const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

    return (
        <div style={{ paddingBottom: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '24px' }}>Notifications</h2>
                    <p style={{ color: 'var(--color-text-body)' }}>You have {unreadCount} unread notifications</p>
                </div>
                {notifications && notifications.length > 0 && (
                    <button
                        onClick={clearAllNotifications}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            color: '#EF4444',
                            background: 'transparent',
                            border: '1px solid #fee2e2'
                        }}
                    >
                        <Trash2 size={16} />
                        Clear All
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {notifications && notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            style={{
                                backgroundColor: notification.read ? 'var(--color-bg-light)' : 'var(--color-white)',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: `4px solid ${notification.type === 'warning' ? '#F59E0B' : '#4F46E5'}`,
                                boxShadow: 'var(--shadow-sm)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                opacity: notification.read ? 0.7 : 1
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{
                                    padding: '10px',
                                    borderRadius: '50%',
                                    background: notification.type === 'warning' ? '#FEF3C7' : '#E0E7FF'
                                }}>
                                    {notification.type === 'warning' ?
                                        <AlertTriangle size={20} color="#D97706" /> :
                                        <Info size={20} color="#4338CA" />
                                    }
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '4px' }}>{notification.title}</h4>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-body)', marginBottom: '8px' }}>
                                        {notification.message}
                                    </p>
                                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                        {new Date(notification.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {!notification.read && (
                                <button
                                    onClick={() => markNotificationRead(notification.id)}
                                    title="Mark as read"
                                    style={{
                                        padding: '8px',
                                        background: 'transparent',
                                        color: 'var(--color-primary)'
                                    }}
                                >
                                    <Check size={20} />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-body)' }}>
                        <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
