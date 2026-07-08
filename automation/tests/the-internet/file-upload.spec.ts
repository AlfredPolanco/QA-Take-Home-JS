import { test, expect } from '@playwright/test';
import path from 'path';
import { FileUploadPage } from '../../pages/the-internet/FileUploadPage';

const SAMPLE_FILE = path.join(__dirname, '../../fixtures/files/sample-upload.txt');

test.describe('File Upload (/upload)', () => {
  test('TC-EX1-UPLOAD-01 a selected file is uploaded and its name is confirmed', async ({
    page,
  }) => {
    const upload = new FileUploadPage(page);
    await upload.open();
    await upload.uploadFile(SAMPLE_FILE);

    await expect(upload.successHeading).toHaveText('File Uploaded!');
    await expect(upload.uploadedFilesText).toHaveText('sample-upload.txt');
  });

  test('TC-EX1-UPLOAD-02 [BUG-EX1-001] submitting without a file should show a validation message, not a server error', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX1-001: submitting the form with no file selected returns HTTP 500 Internal Server Error',
    );
    const upload = new FileUploadPage(page);
    await upload.open();
    const response = await upload.submitWithoutFile();

    // Expected: a 4xx validation response (or an inline client-side error) - not a 5xx crash.
    expect(response.status()).toBeLessThan(500);
  });

  test('TC-EX1-UPLOAD-03 [BUG-EX1-007] the Dropzone.js widget should not render as a large empty box on page load', async ({
    page,
  }) => {
    test.fail(
      true,
      'BUG-EX1-007: the Dropzone.js template elements (#drag-drop-upload, .dz-preview) are not hidden by default and render as a large empty box',
    );
    const upload = new FileUploadPage(page);
    await upload.open();

    // Expected: Dropzone's internal template elements stay hidden until a file is actively
    // being uploaded (that's the whole point of the library) - so even if present in the DOM,
    // they should not be visible on a fresh page load.
    await expect(page.locator('#drag-drop-upload')).toBeHidden();
  });
});
