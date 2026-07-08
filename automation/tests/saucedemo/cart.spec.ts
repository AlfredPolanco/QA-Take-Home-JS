import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';
import { CartPage } from '../../pages/saucedemo/CartPage';
import { saucedemoUsers } from '../../fixtures/test-data';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.standard.username, saucedemoUsers.standard.password);
  });

  test('TC-EX2-CART-01 adding a product updates the cart badge counter', async ({ page }) => {
    const inventory = new InventoryPage(page);
    expect(await inventory.cartBadgeCount()).toBe(0);

    await inventory.addProductToCartByIndex(0);
    expect(await inventory.cartBadgeCount()).toBe(1);
  });

  test('TC-EX2-CART-02 adding multiple products increments the badge counter correctly', async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByIndex(0);
    await inventory.addProductToCartByIndex(1);
    await inventory.addProductToCartByIndex(2);

    expect(await inventory.cartBadgeCount()).toBe(3);
  });

  test('TC-EX2-CART-03 removing a product from the cart page decrements the badge counter', async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByIndex(0);
    await inventory.addProductToCartByIndex(1);
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.removeItemByIndex(0);

    expect(await inventory.cartBadgeCount()).toBe(1);
  });

  test('TC-EX2-CART-04 the cart preserves the exact product name added from the inventory page', async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    const firstProductName = (await inventory.productNames())[0];
    await inventory.addProductToCartByIndex(0);
    await inventory.openCart();

    const cart = new CartPage(page);
    const cartNames = await cart.itemNames();

    expect(cartNames).toContain(firstProductName);
  });

  test('TC-EX2-CART-05 the product detail page shows the same name and price as the inventory tile', async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    const name = (await inventory.productNames())[0];
    const price = (await inventory.productPrices())[0];

    await inventory.itemNames.first().click();
    await expect(page.locator('.inventory_details_name')).toHaveText(name);
    await expect(page.locator('.inventory_details_price')).toHaveText(`$${price.toFixed(2)}`);
  });
});
