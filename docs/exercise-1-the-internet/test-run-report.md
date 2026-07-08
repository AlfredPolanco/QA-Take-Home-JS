# Test Run Report — Exercise 1: Exploratory & Functional Testing

**Date executed:** 2026-07-07
**Executed by:** Alfred Polanco (QA), automation run via Playwright Test 1.61 / Chromium
**Environment:** https://the-internet.herokuapp.com, Chromium desktop 1280×800
**Command:** `npx playwright test --project=the-internet-desktop` (from `automation/`)
**Result:** 20/20 executed, exit code 0 — 12 clean passes, 8 documented known-bug tests (see below)

## Summary

| Metric | Value |
|---|---|
| Total test cases executed | 20 |
| Passed (behavior matches requirement) | 12 |
| Failed as expected / documents an open bug | 8 |
| Blocked | 0 |
| Pass rate (excluding documented bugs) | 100% of testable, non-buggy behavior |

## Results by Test Case

| Test ID | Module | Result | Linked Bug |
|---|---|---|---|
| TC-EX1-AUTH-01 | Form Authentication | ✅ Pass | — |
| TC-EX1-AUTH-02 | Form Authentication | ✅ Pass | — |
| TC-EX1-AUTH-03 | Form Authentication | ✅ Pass | — |
| TC-EX1-AUTH-04 | Form Authentication | ✅ Pass | — |
| TC-EX1-AUTH-05 | Form Authentication | ✅ Pass | — |
| TC-EX1-AUTH-06 | Form Authentication | ✅ Pass | — |
| TC-EX1-AUTH-07 | Form Authentication | ❌ Fail (expected/documented) | BUG-EX1-002 |
| TC-EX1-UPLOAD-01 | File Upload | ✅ Pass | — |
| TC-EX1-UPLOAD-02 | File Upload | ❌ Fail (expected/documented) | BUG-EX1-001 |
| TC-EX1-UPLOAD-03 | File Upload | ❌ Fail (expected/documented) | BUG-EX1-007 |
| TC-EX1-DYN-01 | Dynamic Loading | ✅ Pass | — |
| TC-EX1-DYN-02 | Dynamic Loading | ✅ Pass | — |
| TC-EX1-DROP-01 | Dropdown | ✅ Pass | — |
| TC-EX1-DROP-02 | Dropdown | ✅ Pass | — |
| TC-EX1-DROP-03 | Dropdown | ✅ Pass | — |
| TC-EX1-NAV-01 (Form Authentication) | Navigation | ❌ Fail (expected/documented) | BUG-EX1-003 |
| TC-EX1-NAV-01 (Dynamic Loading Ex.1) | Navigation | ❌ Fail (expected/documented) | BUG-EX1-003 |
| TC-EX1-NAV-01 (Dynamic Loading Ex.2) | Navigation | ❌ Fail (expected/documented) | BUG-EX1-003 |
| TC-EX1-NAV-01 (File Upload) | Navigation | ❌ Fail (expected/documented) | BUG-EX1-003 |
| TC-EX1-NAV-01 (Dropdown) | Navigation | ❌ Fail (expected/documented) | BUG-EX1-003 |

*"Fail (expected/documented)" means the automated test asserts the **correct** expected behavior and is intentionally marked with Playwright's `test.fail()` so the suite exit code stays 0 while the HTML report still visibly flags it. If a test in this state ever starts passing, Playwright reports it as an "unexpected pass" — the signal that the underlying bug was fixed and the annotation should be removed.*

## Notes

- Manual exploratory testing was performed first (see `docs/exercise-1-the-internet/evidence/` for the raw screenshots), then encoded as the automated suite above.
- BUG-EX1-004, BUG-EX1-005, and BUG-EX1-006 (see `bug-board.md`) are usability/hardening observations that don't have a single clean DOM assertion and were validated manually rather than automated, to avoid brittle, low-value assertions.
- BUG-EX1-007 (broken Dropzone.js widget on `/upload`) was found in a follow-up visual review pass using `agent-browser` (real Chrome screenshots + DOM inspection) — it was invisible to the original DOM-only exploratory scripts because the widget is injected client-side by a separate library, outside the static form markup those scripts inspected. This is the reason a visual pass was added on top of scripted DOM assertions.
- Full HTML report with traces/videos on failure is generated at `automation/playwright-report/index.html` after running the suite (`npm run report` to view).
