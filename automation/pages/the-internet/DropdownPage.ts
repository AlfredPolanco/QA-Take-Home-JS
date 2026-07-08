import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { THE_INTERNET_BASE_URL } from '../../config/urls';

export class DropdownPage extends BasePage {
  readonly dropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.dropdown = page.locator('#dropdown');
  }

  async open(): Promise<void> {
    await this.goto(`${THE_INTERNET_BASE_URL}/dropdown`);
  }

  async selectOption(value: '1' | '2'): Promise<void> {
    await this.dropdown.selectOption(value);
  }

  async selectedValue(): Promise<string> {
    return this.dropdown.inputValue();
  }
}
