import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { THE_INTERNET_BASE_URL } from '../../config/urls';

export class DynamicLoadingPage extends BasePage {
  readonly startButton: Locator;
  readonly finishHeading: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);
    this.startButton = page.locator('#start button');
    this.finishHeading = page.locator('#finish h4');
    this.loadingIndicator = page.locator('#loading');
  }

  async open(example: 1 | 2): Promise<void> {
    await this.goto(`${THE_INTERNET_BASE_URL}/dynamic_loading/${example}`);
  }

  async startAndWaitForFinish(): Promise<string> {
    await this.startButton.click();
    await this.finishHeading.waitFor({ state: 'visible' });
    return (await this.finishHeading.innerText()).trim();
  }
}
