import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration for Kosmos WorldPublisher Portal.
 *
 * Runs only Chromium (no Firefox/WebKit for now).
 * Automatically starts the SvelteKit dev server before tests.
 */
export default defineConfig({
	testDir: './tests/e2e',

	/* Maximum time one test can run */
	timeout: 30_000,

	/* Fail the build on CI if you accidentally left test.only in the source code */
	forbidOnly: !!process.env.CI,

	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,

	/* Reporter: concise on CI, verbose locally */
	reporter: process.env.CI ? 'github' : 'list',

	/* Shared settings for all projects */
	use: {
		baseURL: 'http://localhost:5173',

		/* Collect trace on first retry (helpful for debugging CI failures) */
		trace: 'on-first-retry',

		/* Take screenshot on failure */
		screenshot: 'only-on-failure'
	},

	/* Only Chromium for now */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],

	/* Start the SvelteKit dev server before running tests */
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		timeout: 30_000
	}
});
