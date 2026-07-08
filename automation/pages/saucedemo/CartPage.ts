import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.cart_item .inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async itemNames(): Promise<string[]> {
    return this.cartItemNames.allInnerTexts();
  }

  async removeItemByIndex(index: number): Promise<void> {
    await this.cartItems.nth(index).locator('button').click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
