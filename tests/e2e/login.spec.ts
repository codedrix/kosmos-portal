import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
	test('renders with correct title', async ({ page }) => {
		await page.goto('/login');
		// Wait for the page-specific heading to confirm SSR/hydration is complete
		await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
		await expect(page).toHaveTitle('Login - Kosmos WorldPublisher');
	});

	test('displays Welcome back heading', async ({ page }) => {
		await page.goto('/login');
		const heading = page.getByRole('heading', { name: 'Welcome back' });
		await expect(heading).toBeVisible();
	});

	test('has email input field', async ({ page }) => {
		await page.goto('/login');
		const emailInput = page.locator('input[name="email"]');
		await expect(emailInput).toBeVisible();
		await expect(emailInput).toHaveAttribute('type', 'email');
		await expect(emailInput).toHaveAttribute('placeholder', 'you@example.com');
	});

	test('has password input field', async ({ page }) => {
		await page.goto('/login');
		const passwordInput = page.locator('input[name="password"]');
		await expect(passwordInput).toBeVisible();
		await expect(passwordInput).toHaveAttribute('type', 'password');
	});

	test('has Sign in submit button', async ({ page }) => {
		await page.goto('/login');
		const submitButton = page.getByRole('button', { name: 'Sign in' });
		await expect(submitButton).toBeVisible();
		await expect(submitButton).toBeEnabled();
	});

	test('has GitHub OAuth button', async ({ page }) => {
		await page.goto('/login');
		const githubButton = page.getByRole('button', { name: 'GitHub' });
		await expect(githubButton).toBeVisible();
	});

	test('has Google OAuth button', async ({ page }) => {
		await page.goto('/login');
		const googleButton = page.getByRole('button', { name: 'Google' });
		await expect(googleButton).toBeVisible();
	});

	test('has link to register page', async ({ page }) => {
		await page.goto('/login');
		const registerLink = page.locator('a', { hasText: 'Create one' });
		await expect(registerLink).toBeVisible();
		await expect(registerLink).toHaveAttribute('href', '/register');
	});
});
