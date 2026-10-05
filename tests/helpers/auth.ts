import { Page, expect } from '@playwright/test';

export type User = { username: string; password: string; role: 'ADMIN' | 'AGENT' };

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const admin: User = {
  username: required('ADMIN_USERNAME'),
  password: required('ADMIN_PASSWORD'),
  role: 'ADMIN',
};
export const agent: User = {
  username: required('AGENT_USERNAME'),
  password: required('AGENT_PASSWORD'),
  role: 'AGENT',
};

export async function login(page: Page, user: User) {
  await page.goto('/login');
  await page.getByTestId('username').fill(user.username);
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('nav-role')).toHaveText(user.role);
}