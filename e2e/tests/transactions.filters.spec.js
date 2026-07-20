import { test, expect } from '../fixtures/test.js';
import { TransactionsPage } from '../pages/transactions.page.js';

/**
 * Search and filter behavior against a deterministic seeded dataset:
 * 2 income (Acme Corp Payroll, Northwind Consulting) and
 * 2 expense (Uber, Loblaws) transactions.
 */
test.describe('transactions — search & filter', () => {
    test.beforeEach(async ({ seed }) => {
        await seed();
    });

    test('search matches by recipient name, case-insensitively', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        await tx.searchInput.fill('uber');
        await expect(tx.rows).toHaveCount(1);
        await expect(tx.row('Uber')).toBeVisible();
    });

    test('search matches by category', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        await tx.searchInput.fill('grocery');
        await expect(tx.rows).toHaveCount(1);
        await expect(tx.row('Loblaws')).toBeVisible();
    });

    test('type filter isolates income from expenses', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();

        await tx.typeFilter.selectOption('income');
        await expect(tx.rows).toHaveCount(2);
        await expect(tx.row('Uber')).toHaveCount(0);

        await tx.typeFilter.selectOption('expense');
        await expect(tx.rows).toHaveCount(2);
        await expect(tx.row('Acme Corp Payroll')).toHaveCount(0);
    });

    test('search and filter compose (AND semantics)', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        await tx.typeFilter.selectOption('income');
        await tx.searchInput.fill('northwind');
        await expect(tx.rows).toHaveCount(1);
        await expect(tx.row('Northwind Consulting')).toBeVisible();
    });

    test('no matches shows an empty table, not an error', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        await tx.searchInput.fill('zzz-no-such-merchant');
        await expect(tx.rows.filter({ hasText: '$' })).toHaveCount(0);
    });
});
