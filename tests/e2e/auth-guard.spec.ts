import { test, expect } from '@playwright/test';

test.describe('Auth guard (unauthenticated access)', () => {
	test('redirects /dashboard to /login', async ({ page }) => {
		await page.goto('/dashboard');
		await expect(page).toHaveURL(/\/login/);
	});

	test('redirects /upload to /login', async ({ page }) => {
		await page.goto('/upload');
		await expect(page).toHaveURL(/\/login/);
	});

	test('redirects /dashboard/worlds to /login', async ({ page }) => {
		await page.goto('/dashboard/worlds');
		await expect(page).toHaveURL(/\/login/);
	});

	test('redirects /dashboard/settings to /login', async ({ page }) => {
		await page.goto('/dashboard/settings');
		await expect(page).toHaveURL(/\/login/);
	});

	test('redirects /dashboard/analytics to /login', async ({ page }) => {
		await page.goto('/dashboard/analytics');
		await expect(page).toHaveURL(/\/login/);
	});

	test('does NOT redirect public pages', async ({ page }) => {
		// Homepage
		await page.goto('/');
		await expect(page).toHaveURL(/\/$/);

		// Docs
		await page.goto('/docs');
		await expect(page).toHaveURL(/\/docs/);

		// Login
		await page.goto('/login');
		await expect(page).toHaveURL(/\/login/);

		// Register
		await page.goto('/register');
		await expect(page).toHaveURL(/\/register/);

		// Worlds (explore)
		await page.goto('/worlds');
		await expect(page).toHaveURL(/\/worlds/);
	});
});
