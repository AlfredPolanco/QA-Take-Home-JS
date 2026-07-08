import { test, expect } from '@playwright/test';
import { DropdownPage } from '../../pages/the-internet/DropdownPage';

test.describe('Dropdown', () => {
  test('TC-EX1-DROP-01 the placeholder option is selected by default and disabled', async ({
    page,
  }) => {
    const dropdown = new DropdownPage(page);
    await dropdown.open();

    await expect(dropdown.dropdown.locator('option[value=""]')).toHaveAttribute(
      'disabled',
      'disabled',
    );
    expect(await dropdown.selectedValue()).toBe('');
  });

  test('TC-EX1-DROP-02 selecting Option 1 updates the selected value', async ({ page }) => {
    const dropdown = new DropdownPage(page);
    await dropdown.open();
    await dropdown.selectOption('1');

    expect(await dropdown.selectedValue()).toBe('1');
  });

  test('TC-EX1-DROP-03 selecting Option 2 updates the selected value', async ({ page }) => {
    const dropdown = new DropdownPage(page);
    await dropdown.open();
    await dropdown.selectOption('2');

    expect(await dropdown.selectedValue()).toBe('2');
  });
});
