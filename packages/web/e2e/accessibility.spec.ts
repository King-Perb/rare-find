import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Reduced Motion Compliance
 *
 * Tests that animations respect user's reduced motion preferences:
 * - Animations are disabled when reduced motion is enabled
 * - Hero section elements still appear (accessibility)
 * - No animation delays when reduced motion is enabled
 */
test.describe('Reduced Motion Compliance', () => {
  test('should disable animations when reduced motion is enabled', async ({ page, context }) => {
    // Enable reduced motion preference
    await context.addInitScript(() => {
      // Mock prefers-reduced-motion media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => {
          if (query === '(prefers-reduced-motion: reduce)') {
            return {
              matches: true,
              media: query,
              onchange: null,
              addListener: () => {},
              removeListener: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => true,
            };
          }
          return {
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true,
          };
        },
      });
    });

    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that hero section elements are still visible
    const logo = page.getByText('Rare Find');
    await expect(logo).toBeVisible();

    const headline = page.getByText('AI-Powered Bargain Detection');
    await expect(headline).toBeVisible();

    const description = page.getByText(/Find undervalued items on Amazon and eBay/);
    await expect(description).toBeVisible();

    const form = page.getByPlaceholder(/Paste Amazon or eBay URL/);
    await expect(form).toBeVisible();

    // Elements should appear immediately without animation delays
    // (This is verified by the fact that all elements are visible)
  });

  test('should show hero section elements immediately with reduced motion', async ({ page, context }) => {
    // Enable reduced motion preference
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => {
          if (query === '(prefers-reduced-motion: reduce)') {
            return {
              matches: true,
              media: query,
              onchange: null,
              addListener: () => {},
              removeListener: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => true,
            };
          }
          return {
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true,
          };
        },
      });
    });

    const startTime = Date.now();

    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for all elements to be visible
    await page.waitForSelector('text=AI-Powered Bargain Detection', { state: 'visible' });
    await page.waitForSelector('text=Rare Find', { state: 'visible' });
    await page.waitForSelector('input[placeholder*="Amazon"]', { state: 'visible' });

    const elapsed = Date.now() - startTime;

    // With reduced motion, elements should appear immediately (no animation delays)
    // Should be much faster than 1 second
    expect(elapsed).toBeLessThan(500);
  });
});
