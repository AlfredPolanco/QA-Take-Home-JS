import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly menuCloseButton: Locator;
  readonly logoutMenuLink: Locator;
  readonly resetStateMenuLink: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.menuCloseButton = page.locator('#react-burger-cross-btn');
    this.logoutMenuLink = page.locator('#logout_sidebar_link');
    this.resetStateMenuLink = page.locator('#reset_sidebar_link');
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/inventory.html');
  }

  async productNames(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async productPrices(): Promise<number[]> {
    const raw = await this.itemPrices.allInnerTexts();
    return raw.map((p) => Number(p.replace('$', '')));
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    await this.items.nth(index).locator('button').click();
  }

  async removeProductFromCartByIndex(index: number): Promise<void> {
    await this.items.nth(index).locator('button').click();
  }

  async cartBadgeCount(): Promise<number> {
    const count = await this.cartBadge.count();
    if (count === 0) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutMenuLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.menuButton.click();
    await this.resetStateMenuLink.click();
    await this.menuCloseButton.click();
  }
}
