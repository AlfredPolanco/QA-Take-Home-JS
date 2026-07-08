import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';
import { CartPage } from '../../pages/saucedemo/CartPage';
import { CheckoutPage } from '../../pages/saucedemo/CheckoutPage';
import { saucedemoUsers, validCheckoutInfo } from '../../fixtures/test-data';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.standard.username, saucedemoUsers.standard.password);

    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByIndex(0);
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.checkout();
  });

  test('TC-EX2-CHK-01 all fields empty shows a "First Name is required" error', async ({
    page,
  }) => {
    const checkout = new CheckoutPage(page);
    await checkout.continueToOverview();

    expect(await checkout.errorText()).toContain('First Name is required');
  });

  test('TC-EX2-CHK-02 missing last name shows a "Last Name is required" error', async ({
    page,
  }) => {
    const checkout = new CheckoutPage(page);
    await checkout.firstNameInput.fill('Alfred');
    await checkout.continueToOverview();

    expect(await checkout.errorText()).toContain('Last Name is required');
  });

  test('TC-EX2-CHK-03 missing postal code shows a "Postal Code is required" error', async ({
    page,
  }) => {
    const checkout = new CheckoutPage(page);
    await checkout.firstNameInput.fill('Alfred');
    await checkout.lastNameInput.fill('Polanco');
    await checkout.continueToOverview();

    expect(await checkout.errorText()).toContain('Postal Code is required');
  });

  test('TC-EX2-CHK-04 valid information shows an order summary where item total + tax = total', async ({
    page,
  }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo(validCheckoutInfo);
    await checkout.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    const subtotalText = await checkout.subtotalLabel.innerText();
    const taxText = await checkout.taxLabel.innerText();
    const totalText = await checkout.totalLabel.innerText();

    const subtotal = Number(subtotalText.replace('Item total: $', ''));
    const tax = Number(taxText.replace('Tax: $', ''));
    const total = Number(totalText.replace('Total: $', ''));

    expect(Math.round((subtotal + tax) * 100) / 100).toBeCloseTo(total, 2);
  });

  test('TC-EX2-CHK-05 completing checkout shows a confirmation and empties the cart', async ({
    page,
  }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo(validCheckoutInfo);
    await checkout.continueToOverview();
    await checkout.finishOrder();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');

    const inventory = new InventoryPage(page);
    expect(await inventory.cartBadgeCount()).toBe(0);
  });
});
