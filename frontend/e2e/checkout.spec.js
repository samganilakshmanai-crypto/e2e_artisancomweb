import { test, expect } from '@playwright/test';

test.describe('End-to-End Checkout Flow', () => {
    test('navigate to checkout, mock address to view map, and complete QR order', async ({ page }) => {
        await page.goto('/checkout');
        
        // Step 1: Address
        await expect(page.locator('text=Delivery Address')).toBeVisible();
        await page.fill('input[placeholder="123 Main St"]', '456 Market St');
        await page.fill('input[placeholder="New York"]', 'San Francisco');
        await page.fill('input[placeholder="NY 10001"]', 'CA 94104');
        await page.fill('input[placeholder="USA"]', 'USA');

        // Check map visibility implicitly
        await expect(page.locator('iframe')).toBeVisible();

        await page.click('button:has-text("Proceed to Summary")');

        // Step 2: Summary
        await expect(page.locator('text=Order Summary')).toBeVisible();
        await page.click('button:has-text("Select Payment Method")');

        // Step 3: Payment
        await expect(page.locator('text=Payment Processing')).toBeVisible();
        
        // Select QR method
        await page.locator('input[value="qr_upload"]').check({ force: true });
        
        await expect(page.locator('text=Scan to Pay artisan')).toBeVisible();

        // Complete
        await page.click('button:has-text("Complete Secure Order ($48.60)")');
    });
});
