# Test Cases — Exercise 1: Exploratory & Functional Testing

Legend — **Type**: Positive (P) / Negative (N) / Usability (U). **Automated**: spec file + test ID in `automation/tests/the-internet/`.

## A. High-Level Test Case Matrix

| ID | Module | Title | Priority |
|---|---|---|---|
| TC-EX1-AUTH-01..07 | Form Authentication | Login (valid/invalid/empty), logout, direct deep-link, back-button-after-logout | P1 |
| TC-EX1-UPLOAD-01..02 | File Upload | Upload a file successfully; submit with no file selected | P1 |
| TC-EX1-DYN-01..02 | Dynamic Loading | Example 1 (hidden element) and Example 2 (DOM-injected element) render correctly after loading | P2 |
| TC-EX1-DROP-01..03 | Dropdown | Default state and both options selectable | P3 |
| TC-EX1-NAV-01 | Cross-module | Every module page provides a way back to the module index | P1 |

## B. Detailed Test Cases

### Form Authentication (`/login`) — mandatory detailed coverage

| ID | TC-EX1-AUTH-01 |
|---|---|
| Title | Valid credentials log the user into the secure area |
| Type | Positive |
| Priority | P1 |
| Preconditions | Browser open, not authenticated |
| Steps | 1. Go to `/login`. 2. Enter `tomsmith` / `SuperSecretPassword!`. 3. Click Login. |
| Expected Result | Redirected to `/secure`; green flash message "You logged into a secure area!" is shown. |
| Automated | `form-authentication.spec.ts` → TC-EX1-AUTH-01 |

| ID | TC-EX1-AUTH-02 |
|---|---|
| Title | Invalid username is rejected |
| Type | Negative |
| Priority | P1 |
| Preconditions | Browser open, not authenticated |
| Steps | 1. Go to `/login`. 2. Enter an unknown username with the valid password. 3. Click Login. |
| Expected Result | Stays on `/login`; red flash message "Your username is invalid!". |
| Automated | `form-authentication.spec.ts` → TC-EX1-AUTH-02 |

| ID | TC-EX1-AUTH-03 |
|---|---|
| Title | Invalid password is rejected |
| Type | Negative |
| Priority | P1 |
| Steps | 1. Go to `/login`. 2. Enter the valid username with a wrong password. 3. Click Login. |
| Expected Result | Stays on `/login`; red flash message "Your password is invalid!". |
| Automated | `form-authentication.spec.ts` → TC-EX1-AUTH-03 |

| ID | TC-EX1-AUTH-04 |
|---|---|
| Title | Empty credentials are rejected |
| Type | Negative |
| Priority | P2 |
| Steps | 1. Go to `/login`. 2. Leave both fields empty. 3. Click Login. |
| Expected Result | Flash message "Your username is invalid!" (server validates username first). |
| Automated | `form-authentication.spec.ts` → TC-EX1-AUTH-04 |

| ID | TC-EX1-AUTH-05 |
|---|---|
| Title | Logout returns the user to the login page |
| Type | Positive |
| Priority | P1 |
| Preconditions | Logged in as `tomsmith` |
| Steps | 1. From `/secure`, click Logout. |
| Expected Result | Redirected to `/login`; flash message "You logged out of the secure area!". |
| Automated | `form-authentication.spec.ts` → TC-EX1-AUTH-05 |

| ID | TC-EX1-AUTH-06 |
|---|---|
| Title | Direct navigation to `/secure` without a session redirects to login |
| Type | Negative / Security |
| Priority | P1 |
| Steps | 1. As an unauthenticated user, navigate directly to `/secure`. |
| Expected Result | Redirected to `/login` with flash "You must login to view the secure area!". |
| Automated | `form-authentication.spec.ts` → TC-EX1-AUTH-06 |

| ID | TC-EX1-AUTH-07 |
|---|---|
| Title | Secure content should not be viewable via the browser back button after logout |
| Type | Negative / Security |
| Priority | P2 |
| Steps | 1. Log in. 2. Log out. 3. Click the browser Back button. |
| Expected Result | The secure page content should not be rendered (session is gone). |
| Actual Result | **Fails — BUG-EX1-002.** The cached page renders from bfcache. |
| Automated | `form-authentication.spec.ts` → TC-EX1-AUTH-07 (documented as expected-fail via `test.fail()`) |

### File Upload (`/upload`) — mandatory detailed coverage

| ID | TC-EX1-UPLOAD-01 |
|---|---|
| Title | A selected file is uploaded and its name is confirmed |
| Type | Positive |
| Priority | P1 |
| Preconditions | A local file is available |
| Steps | 1. Go to `/upload`. 2. Choose a file. 3. Click Upload. |
| Expected Result | Page shows "File Uploaded!" heading and the exact file name under "Uploaded Files". |
| Automated | `file-upload.spec.ts` → TC-EX1-UPLOAD-01 |

| ID | TC-EX1-UPLOAD-02 |
|---|---|
| Title | Submitting with no file selected should show a validation message, not crash |
| Type | Negative |
| Priority | P1 |
| Steps | 1. Go to `/upload`. 2. Without choosing a file, click Upload. |
| Expected Result | A friendly, non-5xx response — e.g. an inline validation error. |
| Actual Result | **Fails — BUG-EX1-001.** Server returns HTTP 500 / "Internal Server Error". |
| Automated | `file-upload.spec.ts` → TC-EX1-UPLOAD-02 (documented as expected-fail via `test.fail()`) |

*Manual-only observation (not automated — the DOM offers no hook to assert this cleanly): the `<input type="file">` has no `accept` attribute, so the OS file picker does not filter or hint at expected file types (see BUG-EX1-005).*

| ID | TC-EX1-UPLOAD-03 |
|---|---|
| Title | The Dropzone.js widget should not render as a large empty box on page load |
| Type | Usability |
| Priority | P3 |
| Steps | 1. Go to `/upload`. 2. Look below the Upload button. |
| Expected Result | Either no drag-and-drop widget, or a properly styled, functional one — not an empty box. |
| Actual Result | **Fails — BUG-EX1-007.** Found via visual review (agent-browser screenshot inspection) — a Dropzone.js instance is loaded but its template elements aren't hidden, rendering a large (~400×400px) empty red-dashed box with no label or function. |
| Automated | `file-upload.spec.ts` → TC-EX1-UPLOAD-03 (documented as expected-fail via `test.fail()`) |

### Dynamic Loading

| ID | TC-EX1-DYN-01 |
|---|---|
| Title | Example 1: element is hidden via CSS until loading completes |
| Type | Positive |
| Priority | P2 |
| Steps | 1. Go to `/dynamic_loading/1`. 2. Assert the "Hello World!" element is hidden. 3. Click Start. 4. Wait for the loading bar to finish. |
| Expected Result | "Hello World!" becomes visible after loading. |
| Automated | `dynamic-loading.spec.ts` → TC-EX1-DYN-01 |

| ID | TC-EX1-DYN-02 |
|---|---|
| Title | Example 2: element is only added to the DOM after loading completes |
| Type | Positive |
| Priority | P2 |
| Steps | 1. Go to `/dynamic_loading/2`. 2. Assert the finish element does not exist in the DOM yet. 3. Click Start. 4. Wait for loading. |
| Expected Result | "Hello World!" element is inserted into the DOM and visible after loading. |
| Automated | `dynamic-loading.spec.ts` → TC-EX1-DYN-02 |

### Dropdown

| ID | TC-EX1-DROP-01 |
|---|---|
| Title | The placeholder option is selected by default and is not selectable |
| Type | Positive |
| Priority | P3 |
| Steps | 1. Go to `/dropdown`. 2. Inspect the default selection. |
| Expected Result | "Please select an option" is selected and marked `disabled`. |
| Automated | `dropdown.spec.ts` → TC-EX1-DROP-01 |

| ID | TC-EX1-DROP-02 / 03 |
|---|---|
| Title | Selecting Option 1 / Option 2 updates the selected value |
| Type | Positive |
| Priority | P3 |
| Steps | 1. Go to `/dropdown`. 2. Select "Option 1" (then repeat for "Option 2"). |
| Expected Result | The dropdown's selected value updates accordingly and persists until changed again. |
| Automated | `dropdown.spec.ts` → TC-EX1-DROP-02, TC-EX1-DROP-03 |

### Cross-module navigation

| ID | TC-EX1-NAV-01 |
|---|---|
| Title | Every tested module page provides a way back to the module index without the browser Back button |
| Type | Usability |
| Priority | P1 (explicit stated requirement) |
| Steps | 1. Visit `/login`, `/dynamic_loading/1`, `/dynamic_loading/2`, `/upload`, `/dropdown` directly (fresh tab, no history). 2. Look for an in-page link back to `/`. |
| Expected Result | Each page exposes an in-DOM link/breadcrumb back to the module index. |
| Actual Result | **Fails — BUG-EX1-003.** None of the tested pages have one; only the browser Back button works. |
| Automated | `navigation.spec.ts` → TC-EX1-NAV-01 (one parametrized case per module, documented as expected-fail via `test.fail()`) |
