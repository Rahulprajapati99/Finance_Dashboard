import { test, expect } from '../fixtures/test.js';
import { TransactionsPage } from '../pages/transactions.page.js';
import { AppShell } from '../pages/app.page.js';

/**
 * The app is local-first: state must survive a full reload via localStorage.
 */
test.describe('persistence', () => {
    test('a new transaction survives a page reload', async ({ seed, page }) => {
        await seed();
        const tx = new TransactionsPage(page);
        await tx.open();

        await tx.addTransaction({
            type: 'expense',
            amount: 42,
            category: 'Transport',
            recipient: 'Presto Card Reload',
        });
        await expect(tx.row('Presto Card Reload')).toBeVisible();

        await page.reload();
        await expect(tx.table).toBeVisible();
        await expect(tx.row('Presto Card Reload')).toBeVisible();
        await expect(tx.row('Presto Card Reload')).toContainText('-$42');
    });

    test('seeded goals appear on the Goals page', async ({ seededPage }) => {
        const app = new AppShell(seededPage);
        await app.goto('Goals', '/goals');
        await expect(seededPage.getByRole('heading', { name: 'Emergency Fund' })).toBeVisible();
    });
});
