import { test, expect } from '@playwright/test';

test.describe('Home Dashboard', () => {

    test('Unauthenticated user is shown auth modal after delay', async ({ page }) => {
        // 1. Visit dashboard without login
        await page.goto('/dashboard');

        // 2. Should see content initially
        await expect(page.getByText('Featured Events')).toBeVisible();

        // 3. Wait for modal (approx 2s)
        await page.waitForTimeout(2500); // give buffer

        // 4. Modal should block interaction
        const modal = page.locator('text=Join EventUally');
        await expect(modal).toBeVisible();

        // 5. Links should be present
        await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Create an account' })).toBeVisible();
    });

    // Note: Testing authenticated flows requires mocking Supabase or setting up auth state
    // which is outside the scope of this file creation, but structure is here.
});
