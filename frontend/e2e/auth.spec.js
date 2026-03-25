import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should allow a new customer to register and enter the catalog', async ({ page }) => {
        await page.goto('/register');
        
        await page.fill('input[placeholder="John Doe"]', 'E2E Test User');
        await page.fill('input[placeholder="you@example.com"]', `test-${Date.now()}@example.com`);
        await page.fill('input[placeholder="••••••••"]', 'password123');
        
        // Select customer role
        await page.locator('input[value="customer"]').check({ force: true });
        
        await page.click('button[type="submit"]');

        // Should redirect to dashboard -> Products view
        await expect(page.locator('text=Explore Artisan Catalog')).toBeVisible({ timeout: 10000 });
    });

    test('should allow artisan to register with business details', async ({ page }) => {
        await page.goto('/register');
        
        await page.fill('input[placeholder="John Doe"]', 'E2E Artisan User');
        await page.fill('input[placeholder="you@example.com"]', `artisan-${Date.now()}@example.com`);
        await page.fill('input[placeholder="••••••••"]', 'password123');
        
        // Select artisan role
        await page.locator('input[value="artisan"]').check({ force: true });
        
        // Fill conditional artisan fields
        // Since they appear after checking 'artisan', Playwright will wait.
        const textareas = page.locator('textarea');
        await textareas.fill('Beautiful handmade crafts.');
        
        // It's the only input besides name/email/pass without placeholders right now. Let's use precise locators.
        const inputs = page.locator('input[type="text"]');
        await inputs.nth(1).fill('E2E Artisan Store'); // Business name
        
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Shop Overview')).toBeVisible({ timeout: 10000 });
    });
});
