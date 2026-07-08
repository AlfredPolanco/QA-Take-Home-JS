# QA Planning Sheet — Exercise 2: E-commerce Flow & Automation

**Target:** https://www.saucedemo.com/
**Author:** Alfred Polanco (QA) — Claude Code assisted (see `docs/ai-usage-report.md`)
**Date:** 2026-07-07

## 1. Objective

Validate the critical business flows of a simulated e-commerce site (auth → inventory → cart → checkout) across both desktop and mobile viewports before a hypothetical production release, and deliver a maintainable Playwright automation suite covering the same flows.

## 2. Scope

### In scope
- **Authentication:** valid login, invalid login, empty fields, and the seeded `locked_out_user`.
- **Inventory:** product list rendering/layout, all 4 sort options (Name A-Z/Z-A, Price low-high/high-low).
- **Cart:** add/remove, badge counter accuracy, product detail consistency between list/detail/cart.
- **Checkout:** required-field validation, order summary math (subtotal + tax = total), order completion.
- **Responsive behavior:** desktop (1280px) and mobile (375px) viewports for the full purchase flow.
- **Seeded test accounts:** `problem_user`, `performance_glitch_user`, `error_user`, and `visual_user` were all explored deliberately, since saucedemo ships these specifically to contain seeded defects, and the assignment asks to report bugs "even minor ones if found." (`error_user`/`visual_user` were added to scope mid-pass, once a visual review of the login page's own account list showed all 6 seeded accounts, not just the 4 checked initially — see `docs/ai-usage-report.md` §6.)

### Out of scope
- Payment gateway integration (saucedemo's checkout is a simulated, non-functional payment step).
- Any load/performance benchmarking beyond the one timing check on `performance_glitch_user`.
- Safari/WebKit and Firefox engines — the suite runs on Chromium only (see `automation/DOCS.html` for the rationale: it removes an extra ~300MB browser-binary install requirement while still exercising the same responsive CSS via viewport emulation).

## 3. Approach

1. **Live exploratory testing first** — every flow, including the special test accounts, was driven against the real site on 2026-07-07 before any bug was written down (see `evidence/`, ~34 screenshots).
2. **Requirement-driven test case design** — one test case per bullet in the assignment's "Requirements" section.
3. **Automation as the primary regression mechanism** — Playwright + TypeScript, Page Object Model, one Playwright *project* per viewport (`saucedemo-desktop` @ 1280×800, `saucedemo-mobile` @ 375×667) so the same spec files can run responsive checks without duplicating code.
4. **Bugs found through automation and exploration are both logged** in `bug-board.md` with severity/priority/evidence, and encoded as `test.fail()`-annotated regression tests so they surface again automatically if a future run of the suite shows they've been silently fixed (an "unexpected pass").

## 4. Test Environment

| Item | Value |
|---|---|
| Application URL | https://www.saucedemo.com |
| Browser | Chromium (Playwright-managed) |
| Viewports | Desktop 1280×800, Mobile 375×667 (Chromium mobile emulation, touch enabled) |
| Test accounts | `standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user` (all `secret_sauce`) |
| Tooling | Playwright Test 1.61, TypeScript |

## 5. Risks & Assumptions

| Risk | Impact | Mitigation |
|---|---|---|
| Cart state lives in browser `localStorage`, not a real per-account backend — state can leak across logins in the same browser (see BUG-EX2-005). | Medium | Each automated test starts from a fresh browser context (Playwright default), so this doesn't cause flaky tests; it's reported as a product bug, not worked around silently. |
| `performance_glitch_user`'s delay is very likely an intentionally seeded training scenario, not a real regression. | Low | Reported at Priority P3 with that caveat explicit in the bug card, rather than treated as a release blocker. |
| Sort/UI bugs are scoped to `problem_user` only; `standard_user` was verified clean for the same flows. | Low | Both accounts were tested explicitly so the report doesn't over- or under-state blast radius. |

## 6. Entry / Exit Criteria

**Entry:** Requirements doc reviewed; site reachable; standard + seeded test accounts confirmed working.
**Exit:** Test cases for Login, Inventory, Cart, Checkout executed (mandatory scope) plus Responsive Behavior; automation suite green (`npm test` exit code 0); all found bugs (5) logged with severity/priority/evidence, including minor ones per the assignment's instruction.

## 7. Deliverables

- This planning sheet, `test-cases.md`, `test-run-report.md`, `bug-board.md` (this folder) — also mirrored into the Google Sheet workbook.
- Screenshot evidence in `evidence/`.
- Automation suite: `automation/tests/saucedemo/*.spec.ts`.
