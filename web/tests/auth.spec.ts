import { expect, test } from '@playwright/test';

test('user can register and logout', async ({ page }) => {
  const suffix = Date.now();

  await page.goto('/');
  await page.getByLabel('Email').fill(`aleksa+${suffix}@tsf.tech`);
  await page.getByLabel('Full name').fill('Aleksa Agent');
  await page.getByLabel('Password').fill('strongpass123');
  await page.getByTestId('submit-auth-button').click();

  await expect(page.getByTestId('dashboard-name')).toHaveText('Aleksa Agent');

  await page.getByTestId('refresh-button').click();
  await page.getByTestId('logout-button').click();

  await expect(page.getByTestId('submit-auth-button')).toBeVisible();
});
