import { expect } from '@playwright/test';

/** Transactions list + Add Transaction modal. */
export class TransactionsPage {
    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;
        this.addButton = page.getByRole('button', { name: /add transaction/i }).first();
        this.searchInput = page.getByPlaceholder('Search by name or category...');
        this.typeFilter = page.locator('select').first();
        this.table = page.locator('table');
        this.rows = page.locator('table tbody tr');

        // The modal renders the only <form> on the page.
        this.modal = page.locator('form');
        this.amountInput = this.modal.locator('input[type="number"]');
        this.recipientInput = this.modal.locator('input[type="text"]');
        this.categorySelect = this.modal.locator('select');
        this.submitButton = this.modal.getByRole('button', { name: 'Add Transaction' });
    }

    async open() {
        await this.page.goto('/transactions');
        await expect(this.table).toBeVisible();
    }

    row(name) {
        return this.rows.filter({ hasText: name });
    }

    async openModal() {
        await this.addButton.click();
        await expect(this.modal).toBeVisible();
    }

    async chooseType(type) {
        await this.modal.getByRole('button', { name: type, exact: true }).click();
    }

    /** Fills and submits the Add Transaction form. */
    async addTransaction({ type, amount, category, recipient }) {
        await this.openModal();
        if (type) await this.chooseType(type);
        await this.amountInput.fill(String(amount));
        if (category) await this.categorySelect.selectOption(category);
        await this.recipientInput.fill(recipient);
        await this.submitButton.click();
    }
}
