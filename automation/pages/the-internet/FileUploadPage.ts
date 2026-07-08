import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { THE_INTERNET_BASE_URL } from '../../config/urls';

export class FileUploadPage extends BasePage {
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly uploadedFilesText: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.fileInput = page.locator('#file-upload');
    this.submitButton = page.locator('#file-submit');
    this.uploadedFilesText = page.locator('#uploaded-files');
    this.successHeading = page.locator('h3');
  }

  async open(): Promise<void> {
    await this.goto(`${THE_INTERNET_BASE_URL}/upload`);
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
    await this.submitButton.click();
  }

  /** Submits with no file selected and returns the raw HTTP response so callers can assert on status code. */
  async submitWithoutFile(): Promise<Response> {
    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/upload')),
      this.submitButton.click(),
    ]);
    return response;
  }
}
