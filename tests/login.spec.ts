import { test, expect } from '@playwright/test';
import { admin, agent, login } from './helpers/auth';

// Login tests must start signed out, so ignore the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('login page title is correct', async ({ page }) => {
    await page.goto('/login');
    // Prediction: the tab title is set in index.html. Check it and replace.
    await expect(page).toHaveTitle('Qrius Lead Manager');
    await expect(page.getByRole('heading', { name: 'Lead Manager' })).toBeVisible();
  });

  test('admin signs in and reaches the Leads page', async ({ page }) => {
    await login(page, admin);
    await expect(page).toHaveURL(/\/leads$/);
    await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible();
  });

  test('agent signs in and sees their role', async ({ page }) => {
    await login(page, agent);
    await expect(page.getByTestId('nav-role')).toHaveText('AGENT');
    await expect(page.getByTestId('nav-user')).toHaveText(agent.username);
  });

  test('wrong password shows error and stays on login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill(admin.username);
    await page.getByLabel('Password').fill('definitely-wrong');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});