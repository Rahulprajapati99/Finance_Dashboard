// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * E2E configuration for the Finance Dashboard.
 *
 * The app runs against Vite's dev server on localhost, where DataContext
 * bypasses Supabase auth and seeds mock user data — tests then control
 * application state deterministically through localStorage fixtures.
 */
export default defineConfig({
    testDir: './e2e/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        // Sandboxed/CI images may pre-install a Chromium at a fixed path;
        // PW_CHROMIUM_PATH lets any environment point at its own binary.
        ...(process.env.PW_CHROMIUM_PATH
            ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } }
            : {}),
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npm run dev -- --port 5173 --strictPort',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
