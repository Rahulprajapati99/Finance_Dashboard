import { expect } from '@playwright/test';

/**
 * Shell of the application: sidebar navigation + header.
 * Page objects keep selectors in one place so tests read as intent.
 */
export class AppShell {
    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;
        this.sidebar = page.locator('aside.sidebar');
        this.brand = this.sidebar.getByRole('heading', { name: 'RP Solutionss' });
    }

    navLink(label) {
        return this.sidebar.getByRole('link', { name: label });
    }

    async goto(label, expectedPath) {
        await this.navLink(label).click();
        await expect(this.page).toHaveURL(new RegExp(`${expectedPath.replace('/', '\\/')}$`));
    }

    /** The page-level heading rendered inside the content area (not the header bar). */
    contentHeading(name) {
        return this.page.getByRole('heading', { name, exact: true }).last();
    }
}
