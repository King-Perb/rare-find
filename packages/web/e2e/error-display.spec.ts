import { test, expect } from '@playwright/test';

/**
 * Test error display in evaluation form
 * 
 * This test simulates API errors to verify that error messages
 * are displayed correctly (not as "[object Object]")
 */
test.describe('Error Display', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display readable error message when API returns error object', async ({ page }) => {
    // Intercept the API call and return an error response
    // This simulates the ACTUAL error format returned by formatErrorResponse
    // when evaluate-user-listing.ts wraps the OpenAI error in AppError
    await page.route('**/api/marketplace/evaluate', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Failed to evaluate listing with AI', // Generic message (what we actually get)
            code: 'EVALUATION_FAILED',
            details: {
              // The specific error is in details (but client doesn't check this)
              message: '400 Invalid value: \'web_search\'. Supported values are: \'function\' and \'custom\'.',
            },
          },
        }),
      });
    });

    // Fill in the URL input
    const urlInput = page.getByPlaceholder(/paste.*amazon.*ebay/i);
    await urlInput.fill('https://www.amazon.com/dp/B0DMR95L8T');

    // Click the evaluate button
    const evaluateButton = page.getByRole('button', { name: /evaluate/i });
    await evaluateButton.click();

    // Wait for error to appear (use id to avoid Next.js route announcer)
    await page.waitForSelector('#url-error', { timeout: 10000 });

    // Wait a bit for UI to settle
    await page.waitForTimeout(1000);

    // Take screenshot focused on the form area with error
    const formSection = page.locator('form').first();
    await formSection.screenshot({
      path: 'test-results/error-display-form-area.png',
    });

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/error-display-screenshot.png',
      fullPage: true,
    });

    // Get the error message element (use id to avoid Next.js route announcer)
    const errorElement = page.locator('#url-error');
    const errorText = await errorElement.textContent();

    // Log what we found
    console.log('\n=== ERROR DISPLAY TEST ===');
    console.log('Error text found:', errorText);
    console.log('Error element HTML:', await errorElement.innerHTML());
    console.log('Error element visible:', await errorElement.isVisible());
    console.log('==========================\n');

    // Verify error is displayed (not "[object Object]")
    expect(errorText).not.toContain('[object Object]');
    expect(errorText).not.toBeNull();
    expect(errorText?.trim().length).toBeGreaterThan(0);

    // NOTE: With the current implementation, the client only reads error.message
    // which is the generic "Failed to evaluate listing with AI"
    // The specific error is in error.details but the client doesn't check it
    // So we expect the generic message, not the specific one
    expect(errorText).toContain('Failed to evaluate listing with AI');
  });

  test('should display readable error message for different error formats', async ({ page }) => {
    // Test with different error response formats
    const errorFormats = [
      {
        name: 'Middleware format',
        response: {
          error: {
            message: 'Failed to evaluate listing with AI',
            code: 'INTERNAL_ERROR',
          },
        },
      },
      {
        name: 'Simple error format',
        response: {
          success: false,
          error: 'Please provide an Amazon or eBay listing URL',
        },
      },
      {
        name: 'Error object with nested error',
        response: {
          error: {
            error: {
              message: 'Network error occurred',
            },
          },
        },
      },
    ];

    for (const errorFormat of errorFormats) {
      // Intercept API call with this error format
      await page.route('**/api/marketplace/evaluate', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify(errorFormat.response),
        });
      });

      // Clear previous input
      const urlInput = page.getByPlaceholder(/paste.*amazon.*ebay/i);
      await urlInput.clear();
      await urlInput.fill('https://www.amazon.com/dp/B0DMR95L8T');

      // Click evaluate
      const evaluateButton = page.getByRole('button', { name: /evaluate/i });
      await evaluateButton.click();

      // Wait for error (use id to avoid Next.js route announcer)
      await page.waitForSelector('#url-error', { timeout: 5000 });

      // Get error text (use id to avoid Next.js route announcer)
      const errorElement = page.locator('#url-error');
      const errorText = await errorElement.textContent();

      // Take screenshot for this format
      await page.screenshot({
        path: `test-results/error-format-${errorFormat.name.replace(/\s+/g, '-').toLowerCase()}.png`,
        fullPage: true,
      });

      console.log(`\n${errorFormat.name}:`);
      console.log('Error text:', errorText);
      console.log('Response format:', JSON.stringify(errorFormat.response, null, 2));

      // Verify it's not "[object Object]"
      expect(errorText).not.toContain('[object Object]');
      expect(errorText).not.toBeNull();
    }
  });
});

