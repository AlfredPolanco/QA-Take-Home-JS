import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { saucedemoUsers } from '../../fixtures/test-data';

test.describe('Authentication', () => {
  test('TC-EX2-LOGIN-01 valid credentials log the user into the inventory page', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.standard.username, saucedemoUsers.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-EX2-LOGIN-02 invalid credentials are rejected with a clear error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.invalid.username, saucedemoUsers.invalid.password);

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    expect(await login.errorText()).toContain('do not match any user in this service');
  });

  test('TC-EX2-LOGIN-03 empty credentials are rejected', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.loginButton.click();

    expect(await login.errorText()).toContain('Username is required');
  });

  test('TC-EX2-LOGIN-04 a locked out user is rejected with a specific message', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.lockedOut.username, saucedemoUsers.lockedOut.password);

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    expect(await login.errorText()).toContain('this user has been locked out');
  });
});
