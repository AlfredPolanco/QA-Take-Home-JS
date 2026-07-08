# Bug Board — Exercise 1: Exploratory & Functional Testing

This is a plain-document stand-in for the Trello board (columns: **To Do / In Progress / Ready for Retest / Closed**), per the take-home instructions — copy each card into Trello as a list item, one column at a time. All 7 bugs below were found today (2026-07-07) and are unfixed, so they all currently sit in **To Do**.

Severity scale: Blocker > Critical > Major > Minor > Trivial. Priority scale: P1 (urgent) > P2 (high) > P3 (medium) > P4 (low).

## Classification summary (Severity / Priority / Steps / Expected vs Actual)

| ID | Severity | Priority | Steps to Reproduce | Expected | Actual |
|---|---|---|---|---|---|
| **BUG-EX1-001** | Major | P2 | Go to `/upload` → don't choose a file → click Upload | Graceful validation message or 4xx response | `HTTP 500 Internal Server Error` — bare server crash page |
| **BUG-EX1-002** | Major | P2 | Log in → Logout → click browser Back | Authenticated page should not render from cache | "Secure Area" renders from bfcache; no `Cache-Control: no-store` header |
| **BUG-EX1-003** | Major | P1 | Open any of the 5 module pages directly, look for a link back to `/` | An in-page link/breadcrumb back to the module index | None of the 5 pages have one — violates the stated navigation requirement |
| **BUG-EX1-004** | Minor | P3 | Visit any of the 5 tested pages, check the tab title | A descriptive, page-specific `<title>` | Every page shares the literal title "The Internet" |
| **BUG-EX1-005** | Minor | P3 | Inspect `<input type="file">` on `/upload` | An `accept` attribute filtering/hinting expected file types | No `accept` attribute present |
| **BUG-EX1-006** | Trivial | P4 | Inspect `#username`/`#password` on `/login` | `maxlength` + `autocomplete` attributes present | Neither field has these attributes |
| **BUG-EX1-007** | Minor | P3 | Go to `/upload`, look below the Upload button | No widget, or a properly styled functional one | A broken Dropzone.js widget renders as a large empty red-dashed box |

*Full detail — description, environment, numbered repro steps, expected/actual, and evidence — is in the cards below.*

---

## 📋 To Do

### BUG-EX1-001 — File Upload form crashes with HTTP 500 when submitted without a file
- **Title:** File Upload form crashes with HTTP 500 when submitted without a file
- **Module:** File Upload (`/upload`)
- **Environment:** https://the-internet.herokuapp.com/upload — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Major | **Priority:** P2
- **Description:** Submitting the upload form with no file selected doesn't fail gracefully — it crashes the server and returns a raw 500 error page instead of a client- or server-side validation message.
- **Steps to Reproduce:**
  1. Go to https://the-internet.herokuapp.com/upload
  2. Do not choose a file.
  3. Click "Upload".
- **Expected:** A graceful validation message (e.g. "Please choose a file") or a 4xx response.
- **Actual:** The server returns `HTTP 500 Internal Server Error` with a bare "Internal Server Error" page — a server-side crash, not a handled validation case.
- **Evidence:** `evidence/upload-02-no-file-submit.png`, `evidence/upload-04-500-error-fullpage.png`
- **Automated regression test:** `automation/tests/the-internet/file-upload.spec.ts` → TC-EX1-UPLOAD-02

### BUG-EX1-002 — Secure area content is still visible via browser Back button after logout
- **Title:** Secure area content is still visible via browser Back button after logout
- **Module:** Form Authentication (`/secure`, `/login`)
- **Environment:** https://the-internet.herokuapp.com — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Major | **Priority:** P2
- **Description:** After logging out, pressing the browser's Back button re-displays the authenticated "Secure Area" page from cache instead of forcing the user back to the login page, because the response is missing a no-cache header.
- **Steps to Reproduce:**
  1. Log in as `tomsmith` / `SuperSecretPassword!`.
  2. Click Logout.
  3. Click the browser's Back button.
- **Expected:** The authenticated page should not render from cache; ideally the app should force a re-check or the browser should be told not to cache the page.
- **Actual:** The "Secure Area" page renders from the browser's back-forward cache with its original content, because the response has no `Cache-Control: no-store` header. A manual refresh does correctly redirect to `/login`, so this is a cache-hygiene issue rather than a full auth bypass.
- **Evidence:** `evidence/auth-08-back-button-after-logout.png`
- **Automated regression test:** `automation/tests/the-internet/form-authentication.spec.ts` → TC-EX1-AUTH-07

### BUG-EX1-003 — No in-page way back to the module index from any tested module page
- **Title:** No in-page way back to the module index from any tested module page
- **Module:** All tested modules (Form Authentication, Dynamic Loading, File Upload, Dropdown)
- **Environment:** https://the-internet.herokuapp.com/{login,dynamic_loading/1,dynamic_loading/2,upload,dropdown} — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Major | **Priority:** P1 *(violates an explicit stated requirement: "Navigation must remain accessible across modules")*
- **Description:** None of the five tested module pages provide any in-page way to return to the module index — no breadcrumb, no "Home"/"Back" link, nothing in the DOM. The assignment explicitly requires navigation to remain accessible across modules, and this fails that requirement outright.
- **Steps to Reproduce:**
  1. Open `/login`, `/dynamic_loading/1`, `/dynamic_loading/2`, `/upload`, or `/dropdown` directly (e.g. paste the URL in a fresh tab).
  2. Look for a link back to the module index (`/`).
- **Expected:** A visible in-page link, breadcrumb, or "Back to list" control.
- **Actual:** None of the five pages tested have one. The only way back is the browser Back button or manually editing the URL; the footer link only points to an external site ("Elemental Selenium").
- **Evidence:** `evidence/auth-01-login-page.png`, `evidence/dynload-01-example1-before.png`, `evidence/upload-01-page.png`, `evidence/dropdown-01-default.png`
- **Automated regression test:** `automation/tests/the-internet/navigation.spec.ts` → TC-EX1-NAV-01 (5 parametrized cases)

### BUG-EX1-004 — Every page shares the same generic browser tab title
- **Title:** Every page shares the same generic browser tab title
- **Module:** All tested modules
- **Environment:** https://the-internet.herokuapp.com — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Minor | **Priority:** P3
- **Description:** Every page on the site, including the home page and all tested modules, renders the exact same browser tab title ("The Internet"), with no page-specific text — a usability/accessibility gap for anyone navigating multiple tabs.
- **Steps to Reproduce:** Visit any of the 5 tested pages and check the browser tab title / `document.title`.
- **Expected:** A descriptive, page-specific `<title>` (e.g. "The Internet — Login Page"), important for multi-tab orientation and screen-reader users switching tabs.
- **Actual:** Every page (including the home page) shares the literal title "The Internet".
- **Evidence:** captured via console output during exploratory pass (see session log referenced in `docs/ai-usage-report.md`).

### BUG-EX1-005 — File input does not restrict/hint at expected file types
- **Title:** File input does not restrict/hint at expected file types
- **Module:** File Upload (`/upload`)
- **Environment:** https://the-internet.herokuapp.com/upload — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Minor | **Priority:** P3
- **Description:** The file `<input>` on the upload page has no `accept` attribute, so the native OS file picker doesn't filter or hint at which file types the form actually expects.
- **Steps to Reproduce:** Inspect `<input id="file-upload" type="file">` on `/upload`.
- **Expected:** An `accept` attribute (e.g. `accept="image/*,.pdf,.txt"`) so the OS file picker filters/hints at supported types.
- **Actual:** No `accept` attribute is present — any file type can be selected with no guidance, which also means unexpected file types are the first thing that hits the (buggy) submit path in BUG-EX1-001.
- **Evidence:** DOM inspection during exploratory pass (see `docs/ai-usage-report.md`).

### BUG-EX1-006 — Login fields have no client-side hardening (maxlength/autocomplete)
- **Title:** Login fields have no client-side hardening (maxlength/autocomplete)
- **Module:** Form Authentication (`/login`)
- **Environment:** https://the-internet.herokuapp.com/login — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Trivial | **Priority:** P4
- **Description:** The username/password fields lack basic client-side hardening attributes (`maxlength`, `autocomplete`), forcing every validation round trip through the server and missing out on password-manager/accessibility support.
- **Steps to Reproduce:** Inspect `#username` and `#password` on `/login`.
- **Expected:** Reasonable `maxlength`, and `autocomplete="username"` / `autocomplete="current-password"` for password-manager and accessibility support.
- **Actual:** Neither field has these attributes; all validation is a full server round trip with no client-side feedback.
- **Evidence:** DOM inspection during exploratory pass (see `docs/ai-usage-report.md`).

### BUG-EX1-007 — Broken Dropzone.js widget renders as a large empty box on the File Upload page
- **Title:** Broken Dropzone.js widget renders as a large empty box on the File Upload page
- **Module:** File Upload (`/upload`)
- **Environment:** https://the-internet.herokuapp.com/upload — Chromium (Playwright-managed, via `agent-browser`), Desktop 1280×800, 2026-07-07
- **Severity:** Minor | **Priority:** P3
- **Found via:** visual review (this DOM-only exploratory pass missed it entirely — the widget is injected client-side by a separate library, outside the static form markup that was originally inspected).
- **Description:** A Dropzone.js drag-and-drop widget is loaded on the upload page but its stylesheet isn't applying correctly, so internal template elements that should stay hidden until a file is actively uploading are permanently visible as a large, unstyled, non-functional empty box.
- **Steps to Reproduce:**
  1. Go to https://the-internet.herokuapp.com/upload
  2. Look below the "Upload" button.
- **Expected:** Either no drag-and-drop widget (the page copy shouldn't say "drag and drop a file into the area below" if there isn't a working one), or a properly styled, functional Dropzone.js drop target.
- **Actual:** A Dropzone.js v4.0.1 instance is loaded (`#drag-drop-upload`, classes `dz-success-mark`, `dz-preview dz-file-preview`, `dz-hidden-input`, etc.) but its CSS isn't applied correctly — the library's internal template elements (meant to stay hidden until a file is actively being uploaded) render permanently as a large (~400×400px) empty box with a red dashed border, with no label, icon, or instructions inside it. It looks broken/unfinished and doesn't actually respond to a real file drop in testing; the only working upload path is the native `<input type="file">` above it.
- **Evidence:** `evidence/upload-05-broken-dropzone-widget.png` (also visible, unremarked, in `evidence/upload-01-page.png` from the original pass)
- **Automated regression test:** `automation/tests/the-internet/file-upload.spec.ts` → TC-EX1-UPLOAD-03

---

## 🔧 In Progress
*(empty — nothing has been picked up yet)*

## 🔁 Ready for Retest
*(empty)*

## ✅ Closed
*(empty)*
