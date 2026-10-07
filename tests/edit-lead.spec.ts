import { test, expect } from '@playwright/test';
import { addLead, setStatus, uniqueLead, LeadStatus } from './helpers/leads';

const targets: LeadStatus[] = ['Contacted', 'Qualified', 'Lost'];

for (const target of targets) {
  test(`editing a lead to "${target}" updates it in the list`, async ({ page }) => {
    await page.goto('/leads');
    const lead = uniqueLead('New');
    const row = page.getByTestId('lead-row').filter({ hasText: lead.name });

    try {
      await addLead(page, lead);
      await row.getByTestId('edit-button').click();
      await expect(page.getByRole('heading', { name: 'Edit lead' })).toBeVisible();
      await setStatus(page, target);
      await page.getByTestId('lead-modal').getByTestId('save-button').click();

      await expect(page.getByTestId('lead-modal')).toBeHidden();
      await expect(row.getByTestId('lead-status')).toHaveText(target);
    } finally {
      if ((await row.count()) > 0) {
        await row.getByTestId('delete-button').click();
        await expect(row).toHaveCount(0);
      }
    }
  });
}