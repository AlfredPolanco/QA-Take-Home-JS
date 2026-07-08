import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';
import { CartPage } from '../../pages/saucedemo/CartPage';
import { CheckoutPage } from '../../pages/saucedemo/CheckoutPage';
import { saucedemoUsers, validCheckoutInfo } from '../../fixtures/test-data';

// Runs under the `saucedemo-mobile` Playwright project (iPhone SE / 375px viewport).
// Desktop coverage of the same flows lives in login/inventory/cart/checkout.spec.ts,
// which run under `saucedemo-desktop` (1280px viewport).

test.describe('Responsive behavior (375px viewport)', () => {
  test('TC-EX2-RESP-01 the login page has no horizontal overflow at 375px', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });

  test('TC-EX2-RESP-02 the hamburger menu opens and exposes navigation links', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.standard.username, saucedemoUsers.standard.password);

    const inventory = new InventoryPage(page);
    await expect(inventory.menuButton).toBeVisible();
    await inventory.menuButton.click();

    await expect(page.locator('.bm-item-list')).toContainText('Logout');
    await expect(page.locator('.bm-item-list')).toContainText('Reset App State');
  });

  test('TC-EX2-RESP-03 the full purchase flow (login -> cart -> checkout -> confirmation) completes at 375px', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.standard.username, saucedemoUsers.standard.password);

    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByIndex(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      375,
    );

    await inventory.openCart();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      375,
    );

    const cart = new CartPage(page);
    await cart.checkout();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      375,
    );

    const checkout = new CheckoutPage(page);
    await checkout.fillInfo(validCheckoutInfo);
    await checkout.continueToOverview();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      375,
    );

    await checkout.finishOrder();
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC-EX2-RESP-04 [BUG-EX2-006] product card description height should be proportional to its content at 375px', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX2-006: .inventory_item_description has a fixed/stretched height (~496px) sized for the desktop grid, leaving ~250-300px of dead space per card on mobile',
    );
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.standard.username, saucedemoUsers.standard.password);

    const inventory = new InventoryPage(page);
    const descriptionHeight = await inventory.items
      .first()
      .locator('.inventory_item_description')
      .evaluate((el) => el.getBoundingClientRect().height);

    // Expected: on a 375px-wide single-column layout, the description block (name + short
    // description + price/button) shouldn't need much more room than it does on desktop.
    expect(descriptionHeight).toBeLessThan(300);
  });
});
