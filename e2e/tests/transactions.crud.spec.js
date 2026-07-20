import { test, expect } from '../fixtures/test.js';
import { TransactionsPage } from '../pages/transactions.page.js';
import { seedTransactions } from '../fixtures/seed-data.js';

test.describe('transactions — create', () => {
    test('seeded transactions render in the table', async ({ seed, page }) => {
        await seed();
        const tx = new TransactionsPage(page);
        await tx.open();
        await expect(tx.rows).toHaveCount(seedTransactions.length);
        await expect(tx.row('Acme Corp Payroll')).toContainText('+$5,200');
        await expect(tx.row('Loblaws')).toContainText('-$132');
    });

    test('adds an expense through the modal (happy path)', async ({ seed, page }) => {
        await seed();
        const tx = new TransactionsPage(page);
        await tx.open();

        await tx.addTransaction({
            type: 'expense',
            amount: 89.5,
            category: 'Entertainment',
            recipient: 'Cineplex',
        });

        await expect(tx.modal).toBeHidden();          // modal closes on success
        await expect(tx.rows).toHaveCount(seedTransactions.length + 1);
        const row = tx.row('Cineplex');
        await expect(row).toContainText('Entertainment');
        await expect(row).toContainText('-$89.5');
    });

    test('adds an income and it reads as a credit', async ({ seed, page }) => {
        await seed();
        const tx = new TransactionsPage(page);
        await tx.open();

        await tx.addTransaction({
            type: 'income',
            amount: 1500,
            category: 'Investment',
            recipient: 'Dividend — VEQT',
        });

        await expect(tx.row('Dividend — VEQT')).toContainText('+$1,500');
    });
});
