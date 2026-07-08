import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },
  projects: [
    {
      name: 'the-internet-desktop',
      testDir: './tests/the-internet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'saucedemo-desktop',
      testDir: './tests/saucedemo',
      testIgnore: '**/responsive.spec.ts',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'saucedemo-mobile',
      testDir: './tests/saucedemo',
      testMatch: '**/responsive.spec.ts',
      // Chromium with a mobile viewport instead of devices['iPhone SE'] (WebKit) so the suite
      // only requires the Chromium browser binary to run on any machine.
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 667 }, hasTouch: true },
    },
  ],
});
