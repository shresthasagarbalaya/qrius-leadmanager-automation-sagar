import { test as setup } from '@playwright/test';
import { admin, agent, login } from './helpers/auth';

setup('authenticate as admin', async ({ page }) => {
  await login(page, admin);
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});

setup('authenticate as agent', async ({ page }) => {
  await login(page, agent);
  await page.context().storageState({ path: 'playwright/.auth/agent.json' });
});