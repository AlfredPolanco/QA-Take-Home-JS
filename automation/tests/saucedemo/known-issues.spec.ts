import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';
import { CartPage } from '../../pages/saucedemo/CartPage';
import { CheckoutPage } from '../../pages/saucedemo/CheckoutPage';
import { saucedemoUsers, realProductPrices } from '../../fixtures/test-data';

// Each test here documents a real, reproduced bug (see docs/exercise-2-saucedemo/bug-board.md).
// test.fail() keeps `npm test` green while still surfacing these in the HTML report; a test
// that unexpectedly starts passing means the underlying bug was fixed and the annotation is stale.

test.describe('Known issues', () => {
  test('TC-EX2-BUG-01 [BUG-EX2-001] problem_user product images should be distinct, not all identical placeholders', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX2-001: all product images render the same broken/placeholder asset for problem_user',
    );
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.problem.username, saucedemoUsers.problem.password);

    const inventory = new InventoryPage(page);
    const srcs = await inventory.items
      .locator('img')
      .evaluateAll((els) => els.map((e) => e.getAttribute('src')));

    expect(new Set(srcs).size).toBeGreaterThan(1);
  });

  test('TC-EX2-BUG-02 [BUG-EX2-002] problem_user "Price (low to high)" sort should actually reorder products', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX2-002: selecting a price sort option does not reorder the product list for problem_user',
    );
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.problem.username, saucedemoUsers.problem.password);

    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');
    const prices = await inventory.productPrices();

    expect(prices.every((p, i) => i === 0 || prices[i - 1] <= p)).toBe(true);
  });

  test('TC-EX2-BUG-03 [BUG-EX2-003] problem_user should be able to type into the Last Name checkout field', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX2-003: typing in the Last Name field for problem_user leaks the last keystroke into First Name and leaves Last Name empty',
    );
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.problem.username, saucedemoUsers.problem.password);

    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByIndex(0);
    await inventory.openCart();
    const cart = new CartPage(page);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.firstNameInput.fill('Alfred');
    await checkout.lastNameInput.fill('Polanco');

    expect(await checkout.lastNameInput.inputValue()).toBe('Polanco');
  });

  test('TC-EX2-BUG-04 [BUG-EX2-004] performance_glitch_user login should not be dramatically slower than standard_user', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX2-004: performance_glitch_user takes several seconds longer than standard_user to log in',
    );
    const login = new LoginPage(page);
    await login.open();

    const start = Date.now();
    await login.login(
      saucedemoUsers.performanceGlitch.username,
      saucedemoUsers.performanceGlitch.password,
    );
    await page.waitForURL(/inventory\.html/);
    const elapsedMs = Date.now() - start;

    expect(elapsedMs).toBeLessThan(2000);
  });

  test('TC-EX2-BUG-05 [BUG-EX2-005] logging out should clear the cart so the next login starts empty', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX2-005: cart contents persist in localStorage across logout and are inherited by the next login in the same browser',
    );
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.problem.username, saucedemoUsers.problem.password);

    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByIndex(0);
    await inventory.logout();

    await login.login(saucedemoUsers.standard.username, saucedemoUsers.standard.password);
    expect(await inventory.cartBadgeCount()).toBe(0);
  });

  test('TC-EX2-BUG-06 [BUG-EX2-007] visual_user should see the real catalog prices', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX2-007: every product price is wrong for visual_user (does not match the real catalog)',
    );
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.visual.username, saucedemoUsers.visual.password);

    const inventory = new InventoryPage(page);
    const names = await inventory.productNames();
    const prices = await inventory.productPrices();

    names.forEach((name, i) => {
      expect(prices[i]).toBe(realProductPrices[name]);
    });
  });

  test('TC-EX2-BUG-07 [BUG-EX2-008] visual_user product names should all align the same way', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX2-008: two product names carry a stray "align_right" class not present on the other four',
    );
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.visual.username, saucedemoUsers.visual.password);

    const inventory = new InventoryPage(page);
    const classNames = await inventory.itemNames.evaluateAll((els) => els.map((e) => e.className));

    expect(classNames.some((c) => c.includes('align_right'))).toBe(false);
  });

  test('TC-EX2-BUG-08 [BUG-EX2-009] error_user should be able to add every product to the cart', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX2-009: roughly half of "Add to cart" clicks fail (some with a JS error, some silently) for error_user',
    );
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.error.username, saucedemoUsers.error.password);

    const inventory = new InventoryPage(page);
    const productCount = await inventory.items.count();
    for (let i = 0; i < productCount; i++) {
      await inventory.addProductToCartByIndex(i).catch(() => undefined);
    }

    expect(await inventory.cartBadgeCount()).toBe(productCount);
  });
});
