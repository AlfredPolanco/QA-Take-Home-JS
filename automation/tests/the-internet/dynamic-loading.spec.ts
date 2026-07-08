import { test, expect } from '@playwright/test';
import { DynamicLoadingPage } from '../../pages/the-internet/DynamicLoadingPage';

test.describe('Dynamic Loading', () => {
  test('TC-EX1-DYN-01 Example 1: hidden element is revealed after loading completes', async ({
    page,
  }) => {
    const dyn = new DynamicLoadingPage(page);
    await dyn.open(1);

    await expect(dyn.finishHeading).toBeHidden();
    const text = await dyn.startAndWaitForFinish();

    expect(text).toBe('Hello World!');
  });

  test('TC-EX1-DYN-02 Example 2: element is only added to the DOM after loading completes', async ({
    page,
  }) => {
    const dyn = new DynamicLoadingPage(page);
    await dyn.open(2);

    await expect(dyn.finishHeading).toHaveCount(0);
    const text = await dyn.startAndWaitForFinish();

    expect(text).toBe('Hello World!');
  });
});
