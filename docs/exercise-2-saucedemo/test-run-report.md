# Test Run Report — Exercise 2: E-commerce Flow & Automation

**Date executed:** 2026-07-07
**Executed by:** Alfred Polanco (QA), automation run via Playwright Test 1.61 / Chromium
**Environment:** https://www.saucedemo.com, Chromium — desktop 1280×800 + mobile 375×667 emulation
**Command:** `npx playwright test --project=saucedemo-desktop --project=saucedemo-mobile` (from `automation/`)
**Result:** 32/32 executed, exit code 0 — 23 clean passes, 9 documented known-bug tests

## Summary

| Metric | Value |
|---|---|
| Total test cases executed | 32 |
| Passed (behavior matches requirement) | 23 |
| Failed as expected / documents an open bug | 9 |
| Blocked | 0 |

## Results by Test Case

| Test ID | Area | Result | Linked Bug |
|---|---|---|---|
| TC-EX2-LOGIN-01 | Login | ✅ Pass | — |
| TC-EX2-LOGIN-02 | Login | ✅ Pass | — |
| TC-EX2-LOGIN-03 | Login | ✅ Pass | — |
| TC-EX2-LOGIN-04 | Login | ✅ Pass | — |
| TC-EX2-INV-01 | Inventory | ✅ Pass | — |
| TC-EX2-INV-02 | Inventory | ✅ Pass | — |
| TC-EX2-INV-03 (A-Z) | Inventory | ✅ Pass | — |
| TC-EX2-INV-03 (Z-A) | Inventory | ✅ Pass | — |
| TC-EX2-INV-03 (low-high) | Inventory | ✅ Pass | — |
| TC-EX2-INV-03 (high-low) | Inventory | ✅ Pass | — |
| TC-EX2-CART-01 | Cart | ✅ Pass | — |
| TC-EX2-CART-02 | Cart | ✅ Pass | — |
| TC-EX2-CART-03 | Cart | ✅ Pass | — |
| TC-EX2-CART-04 | Cart | ✅ Pass | — |
| TC-EX2-CART-05 | Cart | ✅ Pass | — |
| TC-EX2-CHK-01 | Checkout | ✅ Pass | — |
| TC-EX2-CHK-02 | Checkout | ✅ Pass | — |
| TC-EX2-CHK-03 | Checkout | ✅ Pass | — |
| TC-EX2-CHK-04 | Checkout | ✅ Pass | — |
| TC-EX2-CHK-05 | Checkout | ✅ Pass | — |
| TC-EX2-RESP-01 | Responsive | ✅ Pass | — |
| TC-EX2-RESP-02 | Responsive | ✅ Pass | — |
| TC-EX2-RESP-03 | Responsive | ✅ Pass | — |
| TC-EX2-RESP-04 | Responsive | ❌ Fail (expected/documented) | BUG-EX2-006 |
| TC-EX2-BUG-01 | Known issues (`problem_user`) | ❌ Fail (expected/documented) | BUG-EX2-001 |
| TC-EX2-BUG-02 | Known issues (`problem_user`) | ❌ Fail (expected/documented) | BUG-EX2-002 |
| TC-EX2-BUG-03 | Known issues (`problem_user`) | ❌ Fail (expected/documented) | BUG-EX2-003 |
| TC-EX2-BUG-04 | Known issues (`performance_glitch_user`) | ❌ Fail (expected/documented) | BUG-EX2-004 |
| TC-EX2-BUG-05 | Known issues (cart/session) | ❌ Fail (expected/documented) | BUG-EX2-005 |
| TC-EX2-BUG-06 | Known issues (`visual_user`) | ❌ Fail (expected/documented) | BUG-EX2-007 |
| TC-EX2-BUG-07 | Known issues (`visual_user`) | ❌ Fail (expected/documented) | BUG-EX2-008 |
| TC-EX2-BUG-08 | Known issues (`error_user`) | ❌ Fail (expected/documented) | BUG-EX2-009 |

*"Fail (expected/documented)" — see the note in `docs/exercise-1-the-internet/test-run-report.md`; same `test.fail()` pattern is used here.*

## Notes

- `standard_user` was verified clean end-to-end across Login → Inventory → Cart → Checkout → Responsive; 8 of the 9 bugs are scoped to seeded accounts (`problem_user`, `performance_glitch_user`, `visual_user`, `error_user`) or to cart/session state handling, not to the core happy path. BUG-EX2-006 (mobile card spacing) does affect `standard_user`, but is cosmetic/usability, not functional.
- Manual exploratory testing (34 screenshots in `docs/exercise-2-saucedemo/evidence/`) was performed first, including a dedicated cross-user session-state investigation (`crossuser-*.png`) that led to BUG-EX2-005.
- A follow-up visual review pass using `agent-browser` (real Chrome screenshots + live DOM/CSS inspection) found BUG-EX2-006 — the original scripted responsive checks only asserted `scrollWidth <= 375` (horizontal overflow), which passes; the excessive-vertical-space issue is a different dimension of "responsive" that only shows up by actually looking at a rendered page.
- That same visual pass noticed the login page actually lists 6 seeded accounts, not the 4 originally in scope. Testing the other two (`visual_user`, `error_user`) found 3 more bugs: wrong prices and a misaligned heading for `visual_user` (BUG-EX2-007, BUG-EX2-008), and intermittent "Add to cart" failures for `error_user` (BUG-EX2-009) — see `docs/ai-usage-report.md` §6 for the full investigation, including a tooling quirk that was ruled out rather than misreported as a bug.
- Full HTML report with traces/videos on failure: `automation/playwright-report/index.html` (`npm run report` to view).
