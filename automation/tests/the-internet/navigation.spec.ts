import { test, expect } from '@playwright/test';
import { THE_INTERNET_BASE_URL } from '../../config/urls';

const modules = [
  { name: 'Form Authentication', path: '/login' },
  { name: 'Dynamic Loading Example 1', path: '/dynamic_loading/1' },
  { name: 'Dynamic Loading Example 2', path: '/dynamic_loading/2' },
  { name: 'File Upload', path: '/upload' },
  { name: 'Dropdown', path: '/dropdown' },
];

test.describe('Cross-module navigation', () => {
  for (const module of modules) {
    test(`TC-EX1-NAV-01 [BUG-EX1-003] ${module.name} page provides a way back to the module index`, async ({
      page,
    }) => {
      test.fail(
        true,
        'BUG-EX1-003: module pages have no in-page link back to the module index (/)',
      );
      await page.goto(`${THE_INTERNET_BASE_URL}${module.path}`);

      // Expected: some in-page, in-DOM way to get back to "/" without relying on the browser back button.
      const homeLink = page.locator(`a[href="/"], a[href="${THE_INTERNET_BASE_URL}/"]`);
      await expect(homeLink).toHaveCount(1);
    });
  }
});
