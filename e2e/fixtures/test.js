import { test as base } from '@playwright/test';
import { seedDb } from './seed-data.js';

/**
 * Extended test with storage-seeding fixtures.
 *
 * - `seed(data)`   — registers an init script so localStorage holds the given
 *                    `finance_db` payload before any app code runs.
 * - `seededPage`   — a page already seeded with the default dataset and
 *                    navigated to `/`.
 */
export const test = base.extend({
    seed: async ({ page }, use) => {
        const seed = async (data = seedDb) => {
            // Init scripts run on every navigation, including reloads.
            // Guard so the seed applies once per context — otherwise a
            // reload would silently reset state the test just created.
            await page.addInitScript((db) => {
                if (!window.localStorage.getItem('__e2e_seeded__')) {
                    window.localStorage.setItem('finance_db', JSON.stringify(db));
                    window.localStorage.setItem('__e2e_seeded__', '1');
                }
            }, data);
        };
        await use(seed);
    },

    seededPage: async ({ page, seed }, use) => {
        await seed();
        await page.goto('/');
        await use(page);
    },
});

export { expect } from '@playwright/test';
