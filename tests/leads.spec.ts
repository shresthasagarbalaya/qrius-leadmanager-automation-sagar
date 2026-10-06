import { test, expect } from '@playwright/test';

test.describe('Leads list (admin session)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/leads');
  });

  test('shows the seeded 12 leads', async ({ page }) => {
    await expect(page.getByTestId('lead-row')).toHaveCount(12);
  });

  test('role badge shows ADMIN', async ({ page }) => {
    await expect(page.getByTestId('nav-role')).toHaveText('ADMIN');
  });
});

test.describe('Leads list (agent session)', () => {
  test.use({ storageState: 'playwright/.auth/agent.json' });

  test('role badge shows AGENT', async ({ page }) => {
    await page.goto('/leads');
    await expect(page.getByTestId('nav-role')).toHaveText('AGENT');
  });
});