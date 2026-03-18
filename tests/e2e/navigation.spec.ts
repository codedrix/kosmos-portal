import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
	test('navbar shows Kosmos logo linking to homepage', async ({ page }) => {
		await page.goto('/');
		const logo = page.locator('nav a', { hasText: 'Kosmos' });
		await expect(logo).toBeVisible();
		await expect(logo).toHaveAttribute('href', '/');
	});

	test('navbar has Dashboard link', async ({ page }) => {
		await page.goto('/');
		const dashboardLink = page.locator('nav a', { hasText: 'Dashboard' });
		await expect(dashboardLink).toBeVisible();
		await expect(dashboardLink).toHaveAttribute('href', '/dashboard');
	});

	test('navbar has Upload link', async ({ page }) => {
		await page.goto('/');
		const uploadLink = page.locator('nav a', { hasText: 'Upload' });
		await expect(uploadLink).toBeVisible();
		await expect(uploadLink).toHaveAttribute('href', '/upload');
	});

	test('navbar has Docs link', async ({ page }) => {
		await page.goto('/');
		const docsLink = page.locator('nav a', { hasText: 'Docs' });
		await expect(docsLink).toBeVisible();
		await expect(docsLink).toHaveAttribute('href', '/docs');
	});

	test('navbar shows Login link when unauthenticated', async ({ page }) => {
		await page.goto('/');
		const loginLink = page.locator('nav a', { hasText: 'Login' });
		await expect(loginLink).toBeVisible();
		await expect(loginLink).toHaveAttribute('href', '/login');
	});

	test('navbar shows Register button when unauthenticated', async ({ page }) => {
		await page.goto('/');
		const registerLink = page.locator('nav a', { hasText: 'Register' });
		await expect(registerLink).toBeVisible();
		await expect(registerLink).toHaveAttribute('href', '/register');
	});

	test('footer displays copyright text', async ({ page }) => {
		await page.goto('/');
		const footer = page.locator('footer');
		await expect(footer).toBeVisible();
		await expect(footer).toContainText('Kosmos');
		await expect(footer).toContainText('All rights reserved');
	});

	test('footer displays domain', async ({ page }) => {
		await page.goto('/');
		const domain = page.locator('footer .font-mono');
		await expect(domain).toHaveText('publish.kosmos.world');
	});

	test('docs page loads with correct title', async ({ page }) => {
		await page.goto('/docs');
		await expect(page).toHaveTitle('Documentation — Kosmos WorldPublisher');
		const heading = page.getByRole('heading', { name: 'Documentation' });
		await expect(heading).toBeVisible();
	});

	test('docs page shows four documentation cards', async ({ page }) => {
		await page.goto('/docs');
		await expect(page.getByText('Quick Start Guide')).toBeVisible();
		await expect(page.getByText('World Bundle Format')).toBeVisible();
		await expect(page.getByText('Content Limits')).toBeVisible();
		await expect(page.getByText('Creator SDK Reference')).toBeVisible();
	});

	test('worlds explore page loads with correct title', async ({ page }) => {
		await page.goto('/worlds');
		await expect(page).toHaveTitle('Explore Worlds — Kosmos');
		const heading = page.getByRole('heading', { name: 'Explore Worlds' });
		await expect(heading).toBeVisible();
	});

	test('register page loads with correct title', async ({ page }) => {
		await page.goto('/register');
		await expect(page).toHaveTitle('Register - Kosmos WorldPublisher');
		const heading = page.getByRole('heading', { name: 'Create your account' });
		await expect(heading).toBeVisible();
	});

	test('register page has form fields', async ({ page }) => {
		await page.goto('/register');
		await expect(page.locator('input[name="username"]')).toBeVisible();
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
	});

	test('register page links to login', async ({ page }) => {
		await page.goto('/register');
		const loginLink = page.locator('a', { hasText: 'Sign in' });
		await expect(loginLink).toBeVisible();
		await expect(loginLink).toHaveAttribute('href', '/login');
	});
});
