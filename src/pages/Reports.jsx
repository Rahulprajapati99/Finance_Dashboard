import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

const Reports = () => {
    return (
        <div>
            <h2 style={{ fontSize: '24px', marginBottom: '2rem' }}>Reports</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Report Card 1 */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#E0E7FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={24} color="var(--color-primary)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Monthly Statement</h3>
                        <p style={{ color: 'var(--color-text-body)', fontSize: '14px', marginTop: '4px' }}>Income, expenses, and net savings for the current month.</p>
                    </div>
                    <button style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 500, color: 'var(--color-text-main)' }}>
                        <Download size={16} /> Download PDF
                    </button>
                </div>

                {/* Report Card 2 */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#E0E7FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={24} color="var(--color-primary)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Annual Summary</h3>
                        <p style={{ color: 'var(--color-text-body)', fontSize: '14px', marginTop: '4px' }}>Yearly breakdown of financial activities.</p>
                    </div>
                    <button style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 500, color: 'var(--color-text-main)' }}>
                        <Download size={16} /> Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
