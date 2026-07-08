import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { THE_INTERNET_BASE_URL } from '../../config/urls';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly flashMessage: Locator;
  readonly flashCloseButton: Locator;
  readonly logoutLink: Locator;
  readonly secureAreaHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
    this.flashMessage = page.locator('#flash');
    this.flashCloseButton = page.locator('#flash .close');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.secureAreaHeading = page.locator('h2');
  }

  async open(): Promise<void> {
    await this.goto(`${THE_INTERNET_BASE_URL}/login`);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async flashText(): Promise<string> {
    return (await this.flashMessage.innerText()).trim();
  }
}
