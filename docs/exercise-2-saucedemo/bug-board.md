# Bug Board — Exercise 2: E-commerce Flow & Automation

Plain-document stand-in for the Trello board (columns: **To Do / In Progress / Ready for Retest / Closed**) — copy each card into Trello as a list item. All 9 bugs below were found today (2026-07-07) and are unfixed, so they all currently sit in **To Do**.

Severity scale: Blocker > Critical > Major > Minor > Trivial. Priority scale: P1 (urgent) > P2 (high) > P3 (medium) > P4 (low).

## Classification summary (Severity / Priority / Steps / Expected vs Actual)

| ID | Severity | Priority | Steps to Reproduce | Expected | Actual |
|---|---|---|---|---|---|
| **BUG-EX2-001** | Major | P2 | Log in as `problem_user`, look at product images | Each product shows its own distinct photo | All 6 tiles render the same broken/placeholder image (a dog with a tennis ball) |
| **BUG-EX2-002** | Major | P2 | Log in as `problem_user`, select "Price (low to high)" | Products reorder cheapest → most expensive | List order doesn't change at all |
| **BUG-EX2-003** | Critical | P1 | Log in as `problem_user`, checkout → type First Name → type Last Name | Last Name field accepts the typed text | Last Name stays empty; First Name is overwritten with the last keystroke |
| **BUG-EX2-004** | Major | P3 | Log in as `performance_glitch_user`, time login → inventory load | Comparable to `standard_user` (sub-second) | ~5.0s consistently (5-8x slower) |
| **BUG-EX2-005** | Major | P2 | Log in as `problem_user`, add item, explicit Logout, log in as `standard_user` | New login starts with an empty cart | Cart badge still shows the previous user's item |
| **BUG-EX2-006** | Minor | P3 | Log in as `standard_user` at 375px, view inventory page | Card height roughly matches its content | ~250-300px of dead space per card, ~doubling page scroll length |
| **BUG-EX2-007** | Critical | P1 | Log in as `visual_user`, compare prices to the real catalog | Prices match the real catalog | Every single price is wrong (e.g. Backpack $56.34 vs real $29.99) |
| **BUG-EX2-008** | Minor | P3 | Log in as `visual_user`, compare product name alignment | All 6 names align to the same left edge | 2 of 6 have a stray `align_right` CSS class, visibly shifted right |
| **BUG-EX2-009** | Major | P2 | Log in as `error_user`, click "Add to cart" on all 6 products | All 6 products are added; badge reaches 6 | Only 3 of 6 added; some clicks throw a JS error, others fail silently |

*Full repro steps (numbered), expected/actual detail, and evidence links for each bug are in the cards below.*

---

## 📋 To Do

### BUG-EX2-001 — `problem_user` sees identical broken product images for every product
- **Title:** `problem_user` sees identical broken product images for every product
- **Area:** Inventory
- **Environment:** https://www.saucedemo.com/inventory.html — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Major | **Priority:** P2
- **Description:** For the `problem_user` account, every product on the inventory grid shows the exact same broken placeholder photo instead of its real product image, making the catalog visually unusable for this account.
- **Steps to Reproduce:**
  1. Log in as `problem_user` / `secret_sauce`.
  2. Look at the product images on the inventory grid.
- **Expected:** Each of the 6 products shows its own distinct product photo.
- **Actual:** All 6 tiles render the exact same broken/placeholder image (`/assets/sl-404-*.jpg`) — visually confirmed it's the same stock photo of a dog with a tennis ball in its mouth on every single product, not just a matching filename.
- **Evidence:** `evidence/problemuser-01-inventory.png`
- **Automated regression test:** `automation/tests/saucedemo/known-issues.spec.ts` → TC-EX2-BUG-01

### BUG-EX2-002 — `problem_user` price sorting does not reorder the product list
- **Title:** `problem_user` price sorting does not reorder the product list
- **Area:** Inventory
- **Environment:** https://www.saucedemo.com/inventory.html — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Major | **Priority:** P2
- **Description:** Selecting a price-based sort option ("Price (low to high)") for the `problem_user` account has no effect on the product order — the sort control appears to work but silently does nothing.
- **Steps to Reproduce:**
  1. Log in as `problem_user`.
  2. Select "Price (low to high)" from the sort dropdown.
- **Expected:** Products reorder from cheapest ($7.99) to most expensive ($49.99).
- **Actual:** The list order does not change at all — prices stay in the original, unsorted order (`$29.99, $9.99, $15.99, $49.99, $7.99, $15.99`). Confirmed this is scoped to `problem_user`; `standard_user` sorts correctly for all 4 options.
- **Evidence:** `evidence/problemuser-02-sort-lohi.png`
- **Automated regression test:** `automation/tests/saucedemo/known-issues.spec.ts` → TC-EX2-BUG-02

### BUG-EX2-003 — `problem_user` cannot type a Last Name at checkout
- **Title:** `problem_user` cannot type a Last Name at checkout
- **Area:** Checkout
- **Environment:** https://www.saucedemo.com/checkout-step-one.html — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Critical | **Priority:** P1 *(blocks completing a purchase with correct data for this account)*
- **Description:** Typing into the Last Name field at checkout for `problem_user` doesn't work — the input is misrouted so keystrokes land in the First Name field instead, leaving Last Name permanently empty and First Name corrupted.
- **Steps to Reproduce:**
  1. Log in as `problem_user`, add a product, go to Checkout.
  2. Type "Alfred" into First Name.
  3. Click into Last Name and type "Polanco".
- **Expected:** Last Name field shows "Polanco"; First Name is unaffected.
- **Actual:** The Last Name field stays empty, and the **First Name** field is overwritten with just the last keystroke ("o") — i.e., typing in the Last Name field is misrouted to First Name and only the final character sticks. This makes it impossible to enter a correct Last Name for this account. Re-verified this precisely with `page.keyboard.type()` to rule out a scripting mistake.
- **Evidence:** `evidence/problemuser-05-checkout-field-bug.png`
- **Automated regression test:** `automation/tests/saucedemo/known-issues.spec.ts` → TC-EX2-BUG-03

### BUG-EX2-004 — `performance_glitch_user` login is dramatically slower than other accounts
- **Title:** `performance_glitch_user` login is dramatically slower than other accounts
- **Area:** Authentication / Performance
- **Environment:** https://www.saucedemo.com/ — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Major | **Priority:** P3 *(very likely an intentionally seeded training scenario rather than a real regression — flagged accordingly, not treated as release-blocking)*
- **Description:** Logging in as `performance_glitch_user` takes roughly 5-8x longer than `standard_user` to reach the inventory page, a noticeable and consistent performance regression scoped to this one account.
- **Steps to Reproduce:**
  1. Log in as `performance_glitch_user` / `secret_sauce`; time from clicking Login to the inventory page finishing load.
- **Expected:** Comparable to `standard_user` (sub-second).
- **Actual:** Measured ~5.0s consistently, vs. near-instant for `standard_user` — roughly a 5-8x slowdown.
- **Evidence:** console timing captured during exploratory pass (see `docs/ai-usage-report.md` session log).
- **Automated regression test:** `automation/tests/saucedemo/known-issues.spec.ts` → TC-EX2-BUG-04 (asserts < 2s)

### BUG-EX2-005 — Logging out does not clear the cart; the next login inherits it
- **Title:** Logging out does not clear the cart; the next login inherits it
- **Area:** Cart / Session management
- **Environment:** https://www.saucedemo.com/ — Chromium (Playwright-managed), Desktop 1280×800, same browser context across both logins, 2026-07-07
- **Severity:** Major | **Priority:** P2 *(data-hygiene risk on any shared/kiosk browser: the next person to log in sees the previous person's cart)*
- **Description:** Cart contents are stored in `localStorage` rather than being tied to the authenticated session, so an explicit Logout doesn't clear the cart — the next account to log in in the same browser inherits the previous user's cart items.
- **Steps to Reproduce:**
  1. Log in as `problem_user`, add a product to the cart.
  2. Open the hamburger menu and click **Logout** (not just navigating away).
  3. Log back in as `standard_user` in the same browser.
- **Expected:** `standard_user` starts with an empty cart (0 items).
- **Actual:** The cart badge still shows "1" and the cart page shows the item added under `problem_user`. Confirmed this survives an explicit Logout, not just a raw page navigation; only the "Reset App State" menu action actually clears it. Root cause: cart contents are held in `localStorage`, which is not scoped or reset per authenticated user.
- **Evidence:** `evidence/crossuser-01-problemuser-cart.png`, `evidence/crossuser-02-standarduser-inherited-cart.png`, `evidence/crossuser-03-standarduser-cart-page.png`
- **Automated regression test:** `automation/tests/saucedemo/known-issues.spec.ts` → TC-EX2-BUG-05

### BUG-EX2-006 — Product cards have excessive empty space on mobile, roughly doubling the length of the inventory page
- **Title:** Product cards have excessive empty space on mobile, roughly doubling the length of the inventory page
- **Area:** Inventory / Responsive
- **Environment:** https://www.saucedemo.com/inventory.html — Chromium mobile emulation (via `agent-browser`), 375×667 viewport, 2026-07-07
- **Severity:** Minor | **Priority:** P3
- **Found via:** visual review at 375px — the automated responsive checks only asserted `scrollWidth <= 375` (no horizontal overflow), which passes; this is a vertical-space/usability issue, a different dimension of "responsive" than what those tests cover.
- **Description:** On the 375px mobile layout, each product card's description block is stretched to a fixed height sized for the desktop grid, leaving large empty gaps below the text and roughly doubling how far a user has to scroll to browse the catalog.
- **Steps to Reproduce:**
  1. Log in as `standard_user` at a 375px viewport.
  2. Look at the inventory page.
- **Expected:** Each product card's height should roughly match its content (image + name + short description + price/button), similar to how the desktop 2-column layout looks.
- **Actual:** `.inventory_item_description` renders as a flex column with an explicit `height` (~496px, `justify-content: space-between`) that appears sized for the desktop grid's row-matching logic, but isn't adjusted for the single-column mobile layout. This leaves roughly 250–300px of dead space in every one of the 6 product cards, pushing the page to ~5250px tall on mobile — about double what the content needs — and forcing much more scrolling than necessary to browse the catalog.
- **Evidence:** `evidence/mobile-08-card-spacing-bug-highlighted.png` (red outline shows the oversized description box), `evidence/mobile-02-inventory.png` (full-page capture showing the cumulative effect)
- **Automated regression test:** `automation/tests/saucedemo/responsive.spec.ts` → TC-EX2-RESP-04

### BUG-EX2-007 — `visual_user` sees incorrect prices for every product
- **Title:** `visual_user` sees incorrect prices for every product
- **Area:** Inventory
- **Environment:** https://www.saucedemo.com/inventory.html — Chromium (via `agent-browser`), Desktop 1280×800, 2026-07-07
- **Severity:** Critical | **Priority:** P1 *(displaying wrong prices to a customer is a trust/billing-integrity issue, not just cosmetic)*
- **Found via:** visual review — `visual_user` was previously out of scope; added after noticing the site's own login page lists it as one of 6 accepted accounts (`error_user` and `visual_user` alongside the 4 already tested), and its name specifically implies visual/rendering bugs worth checking.
- **Description:** Every product price shown to the `visual_user` account is wrong — inflated and inconsistent with the real catalog — which for a real store would mean customers are quoted incorrect amounts before checkout.
- **Steps to Reproduce:**
  1. Log in as `visual_user` / `secret_sauce`.
  2. Compare the displayed prices to the real catalog prices (verified against `standard_user`: Backpack $29.99, Bike Light $9.99, Bolt T-Shirt $15.99, Fleece Jacket $49.99, Onesie $7.99, Test.allTheThings() $15.99).
- **Expected:** Prices match the real catalog for every product.
- **Actual:** Every price is wrong: Backpack $56.34, Bike Light $40.76, Bolt T-Shirt $28.85, Fleece Jacket $52.25, Onesie $31, Test.allTheThings() $69.53. Confirmed via the rendered `.inventory_item_price` text, not just the screenshot.
- **Evidence:** `evidence/visualuser-01-inventory-wrong-prices.png`
- **Automated regression test:** `automation/tests/saucedemo/known-issues.spec.ts` → TC-EX2-BUG-06

### BUG-EX2-008 — `visual_user` has visibly misaligned product name text on 2 of 6 products
- **Title:** `visual_user` has visibly misaligned product name text on 2 of 6 products
- **Area:** Inventory / Visual
- **Environment:** https://www.saucedemo.com/inventory.html — Chromium (via `agent-browser`), Desktop 1280×800, 2026-07-07
- **Severity:** Minor | **Priority:** P3
- **Found via:** visual review — the product tiles for "Sauce Labs Bolt T-Shirt" and "Sauce Labs Fleece Jacket" visibly render their title shifted right compared to the other 4 tiles.
- **Description:** Two of the six product name headings on the inventory grid are visibly shifted to the right compared to the other four, caused by a stray CSS class being applied only to those two elements.
- **Steps to Reproduce:**
  1. Log in as `visual_user`.
  2. Compare the left edge of each product name heading against its neighbors.
- **Expected:** All 6 product name headings align to the same left edge within their column, like the other 4 do.
- **Actual:** `.inventory_item_name` for those two products carries an extra, unintended CSS class (`class="inventory_item_name align_right"`) not present on the other four, visibly shifting the text right within its box. Confirmed via `outerHTML`, not just visual impression.
- **Evidence:** `evidence/visualuser-02-misaligned-heading.png` (red outline on the affected element)
- **Automated regression test:** `automation/tests/saucedemo/known-issues.spec.ts` → TC-EX2-BUG-07

### BUG-EX2-009 — `error_user` intermittently fails to add products to the cart
- **Title:** `error_user` intermittently fails to add products to the cart
- **Area:** Inventory / Cart
- **Environment:** https://www.saucedemo.com/inventory.html — Chromium (Playwright-managed), Desktop 1280×800, 2026-07-07
- **Severity:** Major | **Priority:** P2 *(silently losing part of an order is a significant functional/trust issue)*
- **Found via:** targeted testing after discovering `error_user` on the login page's account list; confirmed with Playwright (an `agent-browser` session repeatedly failed to submit this account's login for tooling reasons unrelated to the site — see `docs/ai-usage-report.md` §6 — so this was cross-checked and confirmed with the already-proven-reliable Playwright scripts instead).
- **Description:** For the `error_user` account, clicking "Add to cart" doesn't reliably work — about half the products fail to be added, either with a visible JS console error or with no feedback at all, so the shopper ends up with an incomplete cart without realizing it.
- **Steps to Reproduce:**
  1. Log in as `error_user` / `secret_sauce`.
  2. Click "Add to cart" on all 6 products in order.
- **Expected:** All 6 products are added; the cart badge reaches 6.
- **Actual:** Only 3 of 6 products were actually added (badge stopped at 3; "Bolt T-Shirt", "Fleece Jacket", and "Test.allTheThings()" still showed "Add to cart" instead of "Remove" afterward). The browser console logged `"Failed to add item to the cart."` for some of the failed attempts, and logged nothing at all for at least one other — i.e. some failures are silent, with no feedback to the user that their click didn't work. The checkout flow itself completed normally for the 3 items that did make it into the cart, at the correct prices.
- **Evidence:** `evidence/erroruser-03-after-add-attempts.png` (3 of 6 tiles still show "Add to cart"), `evidence/erroruser-05-checkout.png` (checkout overview correctly shows only the 3 successful items)
- **Automated regression test:** `automation/tests/saucedemo/known-issues.spec.ts` → TC-EX2-BUG-08

---

## 🔧 In Progress
*(empty)*

## 🔁 Ready for Retest
*(empty)*

## ✅ Closed
*(empty)*
