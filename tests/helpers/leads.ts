import { Page, expect } from '@playwright/test';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadInput = { name: string; email: string; company: string; status: LeadStatus };

export function uniqueLead(status: LeadStatus = 'Qualified'): LeadInput {
  const id = Date.now();
  return { name: `Test Lead ${id}`, email: `test${id}@example.com`, company: `TestCo ${id}`, status };
}

export async function addLead(page: Page, lead: LeadInput) {
  await page.getByTestId('add-lead-button').click();
  const modal = page.getByTestId('lead-modal');
  await expect(modal.getByRole('heading', { name: 'New lead' })).toBeVisible();

  await modal.getByTestId('name').fill(lead.name);
  await modal.getByTestId('email').fill(lead.email);
  await modal.getByTestId('company').fill(lead.company);
  await modal.getByTestId('status').selectOption(lead.status);
  await modal.getByTestId('save-button').click();

  await expect(modal).toBeHidden();
  await expect(page.getByTestId('lead-row').filter({ hasText: lead.name })).toBeVisible();
}

export async function setStatus(page: Page, status: LeadStatus) {
  await page.getByTestId('lead-modal').getByTestId('status').selectOption(status);
}