import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
	test('loads with correct title', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Kosmos WorldPublisher — Build Worlds for VR');
	});

	test('displays hero heading', async ({ page }) => {
		await page.goto('/');
		const heading = page.locator('h1');
		await expect(heading).toBeVisible();
		await expect(heading).toHaveText('Build worlds for VR');
	});

	test('displays hero description', async ({ page }) => {
		await page.goto('/');
		const description = page.locator('text=Create, publish, and share immersive 3D worlds');
		await expect(description).toBeVisible();
	});

	test('has Get Started link pointing to /register', async ({ page }) => {
		await page.goto('/');
		const getStarted = page.locator('a', { hasText: 'Get Started' });
		await expect(getStarted).toBeVisible();
		await expect(getStarted).toHaveAttribute('href', '/register');
	});

	test('has Read the Docs link pointing to /docs', async ({ page }) => {
		await page.goto('/');
		const docsLink = page.locator('a', { hasText: 'Read the Docs' });
		await expect(docsLink).toBeVisible();
		await expect(docsLink).toHaveAttribute('href', '/docs');
	});

	test('displays three feature cards', async ({ page }) => {
		await page.goto('/');
		const cards = page.locator('h3');
		await expect(cards.filter({ hasText: 'Create' })).toBeVisible();
		await expect(cards.filter({ hasText: 'Publish' })).toBeVisible();
		await expect(cards.filter({ hasText: 'Share' })).toBeVisible();
	});

	test('displays CTA section with Create Your Account link', async ({ page }) => {
		await page.goto('/');
		const cta = page.locator('a', { hasText: 'Create Your Account' });
		await expect(cta).toBeVisible();
		await expect(cta).toHaveAttribute('href', '/register');
	});
});
