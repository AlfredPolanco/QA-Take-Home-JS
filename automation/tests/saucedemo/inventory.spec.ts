import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage, SortOption } from '../../pages/saucedemo/InventoryPage';
import { saucedemoUsers } from '../../fixtures/test-data';

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(saucedemoUsers.standard.username, saucedemoUsers.standard.password);
  });

  test('TC-EX2-INV-01 the product list displays all 6 products with name, price and an action button', async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    await expect(inventory.items).toHaveCount(6);

    const names = await inventory.productNames();
    const prices = await inventory.productPrices();
    expect(names).toHaveLength(6);
    expect(prices).toHaveLength(6);
    expect(names.every((n) => n.trim().length > 0)).toBe(true);
    expect(prices.every((p) => !Number.isNaN(p))).toBe(true);
  });

  test('TC-EX2-INV-02 every product tile has a consistent layout (image, name, price, button)', async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    const count = await inventory.items.count();
    for (let i = 0; i < count; i++) {
      const tile = inventory.items.nth(i);
      await expect(tile.locator('img')).toBeVisible();
      await expect(tile.locator('.inventory_item_name')).toBeVisible();
      await expect(tile.locator('.inventory_item_price')).toBeVisible();
      await expect(tile.locator('button')).toBeVisible();
    }
  });

  const cases: {
    option: SortOption;
    label: string;
    check: (values: string[] | number[]) => boolean;
  }[] = [
    { option: 'az', label: 'Name (A to Z)', check: (v) => isSortedAsc(v as string[]) },
    { option: 'za', label: 'Name (Z to A)', check: (v) => isSortedDesc(v as string[]) },
    { option: 'lohi', label: 'Price (low to high)', check: (v) => isSortedAsc(v as number[]) },
    { option: 'hilo', label: 'Price (high to low)', check: (v) => isSortedDesc(v as number[]) },
  ];

  for (const { option, label } of cases) {
    test(`TC-EX2-INV-03 sorting by "${label}" orders the products correctly`, async ({ page }) => {
      const inventory = new InventoryPage(page);
      await inventory.sortBy(option);

      if (option === 'az' || option === 'za') {
        const names = await inventory.productNames();
        if (option === 'az') expect(isSortedAsc(names)).toBe(true);
        else expect(isSortedDesc(names)).toBe(true);
      } else {
        const prices = await inventory.productPrices();
        if (option === 'lohi') expect(isSortedAsc(prices)).toBe(true);
        else expect(isSortedDesc(prices)).toBe(true);
      }
    });
  }
});

function isSortedAsc<T extends string | number>(values: T[]): boolean {
  return values.every((v, i) => i === 0 || values[i - 1] <= v);
}

function isSortedDesc<T extends string | number>(values: T[]): boolean {
  return values.every((v, i) => i === 0 || values[i - 1] >= v);
}
