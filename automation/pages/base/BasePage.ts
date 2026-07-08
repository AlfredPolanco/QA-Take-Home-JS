import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  get url(): string {
    return this.page.url();
  }
}
