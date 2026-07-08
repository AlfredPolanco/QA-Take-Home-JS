import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/the-internet/LoginPage';
import { theInternetCredentials } from '../../fixtures/test-data';
import { THE_INTERNET_BASE_URL } from '../../config/urls';

test.describe('Form Authentication (/login)', () => {
  test('TC-EX1-AUTH-01 valid credentials log the user into the secure area', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(theInternetCredentials.valid.username, theInternetCredentials.valid.password);

    await expect(page).toHaveURL(`${THE_INTERNET_BASE_URL}/secure`);
    await expect(login.flashMessage).toContainText('You logged into a secure area!');
  });

  test('TC-EX1-AUTH-02 invalid username is rejected with a clear error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(
      theInternetCredentials.invalidUsername.username,
      theInternetCredentials.invalidUsername.password,
    );

    await expect(page).toHaveURL(`${THE_INTERNET_BASE_URL}/login`);
    await expect(login.flashMessage).toContainText('Your username is invalid!');
  });

  test('TC-EX1-AUTH-03 invalid password is rejected with a clear error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(
      theInternetCredentials.invalidPassword.username,
      theInternetCredentials.invalidPassword.password,
    );

    await expect(page).toHaveURL(`${THE_INTERNET_BASE_URL}/login`);
    await expect(login.flashMessage).toContainText('Your password is invalid!');
  });

  test('TC-EX1-AUTH-04 empty credentials are rejected', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('', '');

    await expect(login.flashMessage).toContainText('Your username is invalid!');
  });

  test('TC-EX1-AUTH-05 logout returns the user to the login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(theInternetCredentials.valid.username, theInternetCredentials.valid.password);
    await login.logout();

    await expect(page).toHaveURL(`${THE_INTERNET_BASE_URL}/login`);
    await expect(login.flashMessage).toContainText('You logged out of the secure area!');
  });

  test('TC-EX1-AUTH-06 direct navigation to /secure without a session redirects to login', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.goto(`${THE_INTERNET_BASE_URL}/secure`);

    await expect(page).toHaveURL(`${THE_INTERNET_BASE_URL}/login`);
    await expect(login.flashMessage).toContainText('You must login to view the secure area!');
  });

  test('TC-EX1-AUTH-07 [BUG-EX1-002] secure content should not be viewable via back button after logout', async ({
    page,
  }) => {
    // Documents an open bug (see docs/exercise-1-the-internet/bug-board.md). Expected to fail until
    // the app sends Cache-Control: no-store on authenticated pages; will flag as an "unexpected pass"
    // (i.e. surface itself again) once fixed, which is the signal to remove this annotation.
    test.fail(
      true,
      'BUG-EX1-002: missing Cache-Control: no-store lets /secure render from bfcache after logout',
    );
    const login = new LoginPage(page);
    await login.open();
    await login.login(theInternetCredentials.valid.username, theInternetCredentials.valid.password);
    await login.logout();
    await page.goBack();

    // Expected: the browser should not render the authenticated page content after logout.
    // Actual (bug): the secure area content is still rendered from the browser cache.
    await expect(page.getByText('Welcome to the Secure Area')).not.toBeVisible();
  });
});
