import { test, expect } from '../fixtures/test.js';
import { TransactionsPage } from '../pages/transactions.page.js';
import { seedTransactions } from '../fixtures/seed-data.js';

/**
 * Negative and boundary coverage for the Add Transaction form.
 * The interesting bugs live at the edges, not on the happy path.
 */
test.describe('transactions — validation', () => {
    test.beforeEach(async ({ seed }) => {
        await seed();
    });

    test('rejects a zero amount', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        await tx.addTransaction({ amount: 0, recipient: 'Zero Test' });

        await expect(page.getByText('Please enter a valid amount greater than 0.')).toBeVisible();
        await expect(tx.modal).toBeVisible();          // modal stays open
        await expect(tx.rows).toHaveCount(seedTransactions.length); // nothing added
    });

    test('rejects a negative amount', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        await tx.addTransaction({ amount: -50, recipient: 'Negative Test' });

        await expect(page.getByText('Please enter a valid amount greater than 0.')).toBeVisible();
        await expect(tx.rows).toHaveCount(seedTransactions.length);
    });

    test('rejects a whitespace-only recipient (bypasses HTML required)', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        await tx.addTransaction({ amount: 10, recipient: '   ' });

        await expect(page.getByText('Recipient/Payer name is required.')).toBeVisible();
        await expect(tx.rows).toHaveCount(seedTransactions.length);
    });

    test('boundary: accepts a 100-character recipient name', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        const name100 = 'B'.repeat(100);
        await tx.addTransaction({ amount: 12, recipient: name100 });

        await expect(tx.modal).toBeHidden();
        await expect(tx.rows).toHaveCount(seedTransactions.length + 1);
    });

    test('boundary: rejects a 101-character recipient name', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        await tx.addTransaction({ amount: 12, recipient: 'B'.repeat(101) });

        await expect(page.getByText('Name is too long (max 100 characters).')).toBeVisible();
        await expect(tx.rows).toHaveCount(seedTransactions.length);
    });

    test('stored recipient is sanitized against HTML injection', async ({ page }) => {
        const tx = new TransactionsPage(page);
        await tx.open();
        await tx.addTransaction({ amount: 5, recipient: '<b>bold</b>vendor' });

        await expect(tx.modal).toBeHidden();
        // sanitizeText strips tags before persisting — the row shows plain text
        await expect(tx.row('boldvendor')).toBeVisible();
        await expect(tx.row('<b>')).toHaveCount(0);
    });
});
