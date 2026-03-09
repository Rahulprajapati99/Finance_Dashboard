"use client";

import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { useData } from '@/context/DataContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

const Reports = () => {
    const { data } = useData();
    const transactions = data?.transactions || [];

    const generateMonthlyPDF = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthlyTx = transactions.filter(tx => {
            const txDate = new Date(tx.date || tx.created_at);
            return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });

        let totalIncome = 0;
        let totalExpense = 0;

        monthlyTx.forEach(tx => {
            const amount = Number(tx.amount) || 0;
            if (tx.type === 'income') totalIncome += amount;
            else if (tx.type === 'expense') totalExpense += amount;
        });

        const netSavings = totalIncome - totalExpense;

        const doc = new jsPDF();

        // Add Header
        doc.setFontSize(22);
        doc.text('Monthly Statement', 14, 22);

        doc.setFontSize(12);
        doc.text(`Month: ${currentDate.toLocaleString('default', { month: 'long' })} ${currentYear}`, 14, 32);

        // Add Summary Summary
        doc.setFontSize(14);
        doc.text(`Total Income: $${totalIncome.toLocaleString()}`, 14, 45);
        doc.text(`Total Expense: $${totalExpense.toLocaleString()}`, 14, 53);
        doc.text(`Net Savings: $${netSavings.toLocaleString()}`, 14, 61);

        // Add Table
        const tableColumn = ["Date", "Category", "Recipient", "Type", "Amount"];
        const tableRows = [];

        monthlyTx.forEach(tx => {
            const txDateString = new Date(tx.date || tx.created_at).toLocaleDateString();
            const txData = [
                txDateString,
                tx.category,
                tx.recipientName,
                tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
                `$${Number(tx.amount).toLocaleString()}`
            ];
            tableRows.push(txData);
        });

        doc.autoTable({
            startY: 70,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [46, 58, 140] }
        });

        doc.save(`Monthly_Statement_${currentDate.toLocaleString('default', { month: 'short' })}_${currentYear}.pdf`);
    };

    const generateAnnualCSV = () => {
        const currentYear = new Date().getFullYear();

        const annualTx = transactions.filter(tx => {
            const txDate = new Date(tx.date || tx.created_at);
            return txDate.getFullYear() === currentYear;
        });

        const csvData = annualTx.map(tx => ({
            "Date": new Date(tx.date || tx.created_at).toLocaleDateString(),
            "Category": tx.category,
            "Recipient/Source": tx.recipientName,
            "Type": tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
            "Amount ($)": tx.amount,
            "Notes": tx.notes || ''
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Annual_Summary_${currentYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                    <button onClick={generateMonthlyPDF} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 500, color: 'var(--color-text-main)', cursor: 'pointer' }}>
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
                    <button onClick={generateAnnualCSV} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 500, color: 'var(--color-text-main)', cursor: 'pointer' }}>
                        <Download size={16} /> Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
