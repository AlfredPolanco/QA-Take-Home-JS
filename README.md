# QA Take-Home Challenge

QA planning, exploratory & functional testing, and a Playwright automation suite for two exercises:

- **Exercise 1** — Exploratory & Functional Testing on [the-internet.herokuapp.com](https://the-internet.herokuapp.com/) (Form Authentication, Dynamic Loading, File Upload, Dropdown).
- **Exercise 2** — E-commerce Flow & Automation on [saucedemo.com](https://www.saucedemo.com/) (Login, Inventory, Cart, Checkout, Responsive).

All bugs listed below were found by actually driving both live sites during this work (see the screenshot evidence in each `docs/exercise-*/evidence/` folder) — nothing here is written from memory of these sites.

## Deliverables map

| Deliverable | Where |
|---|---|
| QA planning sheet, detailed test cases, bugs (classified), test run report (both exercises) | `docs/exercise-1-the-internet/`, `docs/exercise-2-saucedemo/` (Markdown, source of truth) and `docs/sheets/qa-take-home-challenge.xlsx` (same content as an 8-tab spreadsheet — Planning / Test Cases / **Bugs** / Test Run Report × 2 exercises — ready to upload to Google Sheets) |
| Bug board (Trello stand-in) | `docs/exercise-1-the-internet/bug-board.md`, `docs/exercise-2-saucedemo/bug-board.md` — each opens with a classification summary table (ID / **Severity** / **Priority** / **Steps to Reproduce** / **Expected vs Actual**), then Kanban columns (To Do / In Progress / Ready for Retest / Closed) with a full card per bug including evidence. Copy these into a real Trello board when ready. |
| Evidence (screenshots) | `docs/exercise-1-the-internet/evidence/`, `docs/exercise-2-saucedemo/evidence/` |
| Automation suite | `automation/` (Playwright + TypeScript, POM) — zipped copy at `automation.zip` |
| How to run the automation suite | `automation/DOCS.html` (open in a browser) |
| AI usage report | `docs/ai-usage-report.md` |

## Bugs found (16 total, all reproduced live)

**Exercise 1** (7): HTTP 500 on empty File Upload submit, secure area cached via back-button after logout, no in-page navigation back to the module index on any tested page (violates a stated requirement), a broken Dropzone.js widget rendering as a large empty box on the File Upload page, generic page title site-wide, no `accept` filter on the file input, no client-side hardening on login fields. Full detail in `docs/exercise-1-the-internet/bug-board.md`.

**Exercise 2** (9): `problem_user` has identical broken product images, `problem_user`'s price sort doesn't reorder the list, `problem_user` can't type a Last Name at checkout (keystrokes leak into First Name), `performance_glitch_user` logs in ~5x slower, Logout doesn't clear the cart (it persists via `localStorage` into the next login), product cards on the 375px mobile layout have ~250-300px of dead space each, `visual_user` sees wrong prices for every product, `visual_user` has a visibly misaligned product name on 2 of 6 tiles (a stray CSS class), and `error_user` can only add half of the 6 products to the cart (some clicks throw a JS error, some silently no-op). Full detail in `docs/exercise-2-saucedemo/bug-board.md`.

3 of those 16 (page title, missing `accept` attribute, missing client-side hardening — all in Exercise 1) are manual-only observations without a clean single DOM assertion; the other 13 are encoded as automated regression tests (see below). Five bugs (the Dropzone widget, the mobile card spacing, and all 3 `visual_user`/`error_user` bugs) were found in a dedicated visual-review pass using [agent-browser](https://github.com/vercel-labs/agent-browser) — real Chrome screenshots and live DOM/CSS inspection caught what the original DOM-only exploratory scripts missed, including two accounts (`visual_user`, `error_user`) that had originally been scoped out by mistake.

## Running the automation suite

```bash
cd automation
npm install
npx playwright install chromium
npm test
```

52 tests, exit code 0 (17 of them intentionally document the open bugs above via Playwright's `test.fail()` — see `automation/DOCS.html` §7 for why that's the right pattern for a suite you can trust in CI). Full instructions, project structure, and how to extend the suite: open `automation/DOCS.html` in a browser.

## Tooling

- **Framework:** Playwright Test + TypeScript, Page Object Model (`automation/pages/`).
- **Formatting:** Prettier, enforced on every commit via Husky + lint-staged (`.husky/pre-commit` → `automation/` → `lint-staged` → `prettier --write` on staged files).
- **Self-healing locators:** `.claude/agents/healer.md` is a Claude Code subagent scoped to diagnosing and fixing broken Playwright locators against the live DOM when these public training sites change their markup — see `automation/DOCS.html` §10.

## AI usage

Claude Code (Claude Sonnet 5) was used throughout — for live exploratory scripts against both sites, automation code, bug analysis, and this documentation. `docs/ai-usage-report.md` covers the specific tasks, prompts, validation method, and where its first attempt needed a manual correction.
