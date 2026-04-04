import { test, expect } from '@playwright/test';

// ── Page Load ───────────────────────────────────────────────────────────────

test.describe('page load', () => {
	test('homepage renders', async ({ page }) => {
		const response = await page.goto('/');
		expect(response?.status()).toBe(200);
		await expect(page.locator('header[data-prod-signal-nav]')).toBeVisible();
	});

	test('studio page renders with hero + marquee + showcase', async ({ page }) => {
		const response = await page.goto('/studio/');
		expect(response?.status()).toBe(200);

		// Hero section with title words
		await expect(page.locator('[data-hero-title="left"]')).toBeVisible();
		await expect(page.locator('[data-hero-title="right"]')).toBeVisible();

		// Card stack (aria-hidden decorative element — check it's attached, not visible)
		await expect(page.locator('[data-hero-stack-stage]')).toBeAttached();

		// Dock thumbnails
		await expect(page.locator('[data-hero-dock]')).toBeVisible();

		// Client marquee
		await expect(page.locator('.client-marquee')).toBeVisible();

		// Showcase section
		await expect(page.locator('#showcase')).toBeVisible();
	});

	test('404 page renders', async ({ page }) => {
		const response = await page.goto('/nonexistent-page/');
		expect(response?.status()).toBe(404);
	});
});

// ── Navigation ──────────────────────────────────────────────────────────────

test.describe('navigation', () => {
	test('navbar is visible and has brand', async ({ page }) => {
		await page.goto('/studio/');
		const nav = page.locator('header[data-prod-signal-nav]');
		await expect(nav).toBeVisible();
		await expect(nav.locator('.prod-signal-nav__brand')).toBeVisible();
	});

	test('mobile nav opens and closes', async ({ page, isMobile }) => {
		test.skip(!isMobile, 'mobile-only test');
		await page.goto('/studio/');

		const trigger = page.locator('[data-nav-trigger]');
		const panel = page.locator('[data-nav-panel]');

		// Panel starts hidden
		await expect(panel).toHaveAttribute('aria-hidden', 'true');

		// Open
		await trigger.click();
		await expect(panel).not.toHaveAttribute('aria-hidden', 'true');

		// Close with trigger
		await trigger.click();
		await expect(panel).toHaveAttribute('aria-hidden', 'true');
	});

	test('mobile nav closes on Escape', async ({ page, isMobile }) => {
		test.skip(!isMobile, 'mobile-only test');
		await page.goto('/studio/');

		const trigger = page.locator('[data-nav-trigger]');
		const panel = page.locator('[data-nav-panel]');

		await trigger.click();
		await expect(panel).not.toHaveAttribute('aria-hidden', 'true');

		await page.keyboard.press('Escape');
		await expect(panel).toHaveAttribute('aria-hidden', 'true');
	});
});

// ── Showcase Tabs ───────────────────────────────────────────────────────────

test.describe('showcase tabs', () => {
	test('tab click switches active panel', async ({ page }) => {
		await page.goto('/studio/');

		const tabs = page.locator('.sc3__nav-item');
		const firstTab = tabs.first();
		const secondTab = tabs.nth(1);

		// First tab starts active
		await expect(firstTab).toHaveClass(/active/);

		// Get target panel id from second tab
		const targetId = await secondTab.getAttribute('data-target');

		// Click second tab
		await secondTab.click();
		await expect(secondTab).toHaveClass(/active/);
		await expect(firstTab).not.toHaveClass(/active/);

		// Panel switched
		const activePanel = page.locator(`.sc3__panel[data-panel="${targetId}"]`);
		await expect(activePanel).toHaveClass(/active/);
	});

	test('tab keyboard navigation works', async ({ page, isMobile }) => {
		test.skip(isMobile, 'desktop-only test');
		await page.goto('/studio/');

		const firstTab = page.locator('.sc3__nav-item').first();
		await firstTab.focus();

		// ArrowRight moves to next tab
		await page.keyboard.press('ArrowRight');
		const secondTab = page.locator('.sc3__nav-item').nth(1);
		await expect(secondTab).toBeFocused();
		await expect(secondTab).toHaveClass(/active/);
	});
});

// ── Visual Snapshots ────────────────────────────────────────────────────────

/** Freeze all JS animations (rAF loops, timers) for stable screenshots */
async function freezeAnimations(page: import('@playwright/test').Page) {
	await page.evaluate(() => {
		// Override rAF to stop animation loops
		window.requestAnimationFrame = () => 0;
		window.cancelAnimationFrame = () => {};
		// Clear all pending timers
		const highId = window.setTimeout(() => {}, 0);
		for (let i = 0; i <= highId; i++) window.clearTimeout(i);
		const highInterval = window.setInterval(() => {}, 10000);
		for (let i = 0; i <= highInterval; i++) window.clearInterval(i);
	});
}

test.describe('visual snapshots', () => {
	const breakpoints = [
		{ name: '375', width: 375, height: 812 },
		{ name: '720', width: 720, height: 1024 },
		{ name: '1440', width: 1440, height: 900 },
	];

	for (const bp of breakpoints) {
		test(`studio hero at ${bp.name}px`, async ({ page }) => {
			await page.setViewportSize({ width: bp.width, height: bp.height });
			await page.goto('/studio/');

			// Let initial animation run, then freeze for stable snapshot
			await page.waitForTimeout(2000);
			await freezeAnimations(page);
			await page.waitForTimeout(200);

			await expect(page.locator('.shoots-hero')).toHaveScreenshot(`studio-hero-${bp.name}.png`, {
				maxDiffPixelRatio: 0.05,
			});
		});

		test(`showcase at ${bp.name}px`, async ({ page }) => {
			await page.setViewportSize({ width: bp.width, height: bp.height });
			await page.goto('/studio/');

			const showcase = page.locator('#showcase');
			await showcase.scrollIntoViewIfNeeded();
			await page.waitForTimeout(500);
			await freezeAnimations(page);
			await page.waitForTimeout(200);

			await expect(showcase).toHaveScreenshot(`showcase-${bp.name}.png`, {
				maxDiffPixelRatio: 0.02,
			});
		});
	}
});
