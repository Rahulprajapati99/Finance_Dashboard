import { test, expect } from '../fixtures/test.js';
import { AppShell } from '../pages/app.page.js';

/**
 * Smoke: the shell renders and every sidebar destination loads its page.
 * Fast, deterministic, and the first thing to break if routing regresses.
 */
test.describe('navigation smoke', () => {
    test('renders the app shell with brand and navigation', async ({ seededPage }) => {
        const app = new AppShell(seededPage);
        await expect(app.brand).toBeVisible();
        for (const label of ['Dashboard', 'Transactions', 'Goals', 'Analytics', 'Reports']) {
            await expect(app.navLink(label)).toBeVisible();
        }
    });

    const destinations = [
        { label: 'Transactions', path: '/transactions', heading: 'Transactions' },
        { label: 'Goals', path: '/goals', heading: 'Savings Goals' },
        { label: 'Analytics', path: '/analytics', heading: 'Analytics' },
        { label: 'Reports', path: '/reports', heading: 'Reports' },
        { label: 'Dashboard', path: '/', heading: 'Overview' },
    ];

    for (const { label, path, heading } of destinations) {
        test(`navigates to ${label}`, async ({ seededPage }) => {
            const app = new AppShell(seededPage);
            await app.goto(label, path);
            await expect(app.contentHeading(heading)).toBeVisible();
        });
    }

    test('unknown routes redirect to the dashboard', async ({ seededPage }) => {
        await seededPage.goto('/definitely-not-a-page');
        await expect(seededPage).toHaveURL(/\/$/);
        await expect(new AppShell(seededPage).contentHeading('Overview')).toBeVisible();
    });
});
