import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/leads');
    await expect(page.getByTestId('lead-row')).toHaveCount(12);
  });

  test('searching by name narrows the list', async ({ page }) => {
    const rows = page.getByTestId('lead-row');
    const name = (await rows.first().getByTestId('lead-name').textContent())!.trim();

    await page.getByTestId('search-input').fill(name);

    await expect(rows).not.toHaveCount(12);
    await expect(rows.first().getByTestId('lead-name')).toHaveText(name);
    await expect(rows.filter({ hasText: name })).toHaveCount(await rows.count());
  });

  test('searching by company narrows the list', async ({ page }) => {
    const rows = page.getByTestId('lead-row');
    // Company is the 3rd column (index 2)
    const company = (await rows.first().getByRole('cell').nth(2).textContent())!.trim();

    await page.getByTestId('search-input').fill(company);

    await expect(rows.first().getByRole('cell').nth(2)).toHaveText(company);
    await expect(rows.filter({ hasText: company })).toHaveCount(await rows.count());
  });

  test('no match shows the empty state', async ({ page }) => {
    await page.getByTestId('search-input').fill('zzz-no-such-lead');
    await expect(page.getByTestId('lead-row')).toHaveCount(0);
    await expect(page.getByTestId('empty-state')).toHaveText('No leads found.');
  });

  test('count text reflects the number of leads shown', async ({ page }) => {
    const rows = page.getByTestId('lead-row');
    const name = (await rows.first().getByTestId('lead-name').textContent())!.trim();

    await page.getByTestId('search-input').fill(name);
    await expect(rows).not.toHaveCount(12);

    const shown = await rows.count();
    // Prediction: this FAILS. The component renders "Showing {total} of {total}".
    await expect(page.getByTestId('lead-count')).toHaveText(`Showing ${shown} of 12 leads`);
  });
});