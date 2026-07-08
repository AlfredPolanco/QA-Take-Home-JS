# Test Cases — Exercise 2: E-commerce Flow & Automation

Legend — **Type**: Positive (P) / Negative (N) / Usability (U). **Automated**: spec file + test ID in `automation/tests/saucedemo/`.

## A. High-Level Test Case Matrix

| ID | Area | Title | Priority |
|---|---|---|---|
| TC-EX2-LOGIN-01..04 | Login | Valid, invalid, empty, locked-out | P1 |
| TC-EX2-INV-01..03 | Inventory | Product list, layout consistency, all 4 sort options | P1 |
| TC-EX2-CART-01..05 | Cart | Add, add multiple, remove, name preserved, detail-page consistency | P1 |
| TC-EX2-CHK-01..05 | Checkout | Field validation ×3, order summary math, order completion | P1 |
| TC-EX2-RESP-01..03 | Responsive | No horizontal overflow, mobile menu, full purchase flow at 375px | P2 |
| TC-EX2-BUG-01..05 | Known issues | Seeded-account defects (`problem_user`, `performance_glitch_user`) and cart/session behavior | P1-P3 |

## B. Detailed Test Cases

### Login

| ID | TC-EX2-LOGIN-01 |
|---|---|
| Title | Valid credentials log the user into the inventory page |
| Type | Positive | Priority | P1 |
| Steps | 1. Go to saucedemo.com. 2. Enter `standard_user` / `secret_sauce`. 3. Click Login. |
| Expected | Redirected to `/inventory.html`. |
| Automated | `login.spec.ts` → TC-EX2-LOGIN-01 |

| ID | TC-EX2-LOGIN-02 |
|---|---|
| Title | Invalid credentials are rejected with a clear error |
| Type | Negative | Priority | P1 |
| Steps | 1. Enter a non-existent username/password. 2. Click Login. |
| Expected | Stays on `/`; error banner: "Epic sadface: Username and password do not match any user in this service". |
| Automated | `login.spec.ts` → TC-EX2-LOGIN-02 |

| ID | TC-EX2-LOGIN-03 |
|---|---|
| Title | Empty credentials are rejected |
| Type | Negative | Priority | P2 |
| Steps | 1. Leave both fields empty. 2. Click Login. |
| Expected | Error banner: "Epic sadface: Username is required". |
| Automated | `login.spec.ts` → TC-EX2-LOGIN-03 |

| ID | TC-EX2-LOGIN-04 |
|---|---|
| Title | A locked-out user is rejected with a specific message |
| Type | Negative | Priority | P1 |
| Steps | 1. Log in as `locked_out_user` / `secret_sauce`. |
| Expected | Error banner: "Epic sadface: Sorry, this user has been locked out." |
| Automated | `login.spec.ts` → TC-EX2-LOGIN-04 |

### Inventory

| ID | TC-EX2-INV-01 |
|---|---|
| Title | The product list displays all 6 products with name, price and an action button |
| Type | Positive | Priority | P1 |
| Steps | 1. Log in as `standard_user`. 2. Inspect the inventory grid. |
| Expected | Exactly 6 product tiles, each with a non-empty name and a valid `$` price. |
| Automated | `inventory.spec.ts` → TC-EX2-INV-01 |

| ID | TC-EX2-INV-02 |
|---|---|
| Title | Every product tile has a consistent layout |
| Type | Usability | Priority | P2 |
| Steps | 1. For each of the 6 tiles, check for an image, name, price, and button. |
| Expected | All 4 elements are present and visible on every tile. |
| Automated | `inventory.spec.ts` → TC-EX2-INV-02 |

| ID | TC-EX2-INV-03 |
|---|---|
| Title | Sorting by Name (A-Z / Z-A) and Price (low-high / high-low) orders the list correctly |
| Type | Positive | Priority | P1 |
| Steps | 1. Select each of the 4 sort options in turn. 2. Read the resulting name/price order. |
| Expected | The list is strictly ordered per the selected option. |
| Automated | `inventory.spec.ts` → TC-EX2-INV-03 (×4, one per sort option) |

### Cart

| ID | TC-EX2-CART-01 |
|---|---|
| Title | Adding a product updates the cart badge counter |
| Type | Positive | Priority | P1 |
| Steps | 1. Note badge is absent (0 items). 2. Click "Add to cart" on the first product. |
| Expected | Badge shows "1". |
| Automated | `cart.spec.ts` → TC-EX2-CART-01 |

| ID | TC-EX2-CART-02 |
|---|---|
| Title | Adding multiple products increments the badge counter correctly |
| Type | Positive | Priority | P1 |
| Steps | 1. Add 3 different products to the cart. |
| Expected | Badge shows "3". |
| Automated | `cart.spec.ts` → TC-EX2-CART-02 |

| ID | TC-EX2-CART-03 |
|---|---|
| Title | Removing a product from the cart page decrements the badge counter |
| Type | Positive | Priority | P1 |
| Steps | 1. Add 2 products. 2. Open the cart. 3. Remove one. |
| Expected | Badge decreases from "2" to "1"; the remaining item is the correct one. |
| Automated | `cart.spec.ts` → TC-EX2-CART-03 |

| ID | TC-EX2-CART-04 |
|---|---|
| Title | The cart preserves the exact product name added from the inventory page |
| Type | Positive | Priority | P1 |
| Steps | 1. Note the name of the first product. 2. Add it to the cart. 3. Open the cart. |
| Expected | The cart line item name exactly matches the inventory tile name. |
| Automated | `cart.spec.ts` → TC-EX2-CART-04 |

| ID | TC-EX2-CART-05 |
|---|---|
| Title | The product detail page shows the same name/price as the inventory tile |
| Type | Positive | Priority | P2 |
| Steps | 1. Note name/price on the inventory tile. 2. Click into the product detail page. |
| Expected | Name and price match exactly. |
| Automated | `cart.spec.ts` → TC-EX2-CART-05 |

### Checkout

| ID | TC-EX2-CHK-01 / 02 / 03 |
|---|---|
| Title | Required-field validation (First Name, Last Name, Postal Code, in order) |
| Type | Negative | Priority | P1 |
| Steps | 1. Add a product, go to cart, click Checkout. 2. Submit with progressively more fields filled (none → first name only → first+last name only). |
| Expected | Each state shows the specific "<Field> is required" error, in field order. |
| Automated | `checkout.spec.ts` → TC-EX2-CHK-01, -02, -03 |

| ID | TC-EX2-CHK-04 |
|---|---|
| Title | Valid information shows an order summary where item total + tax = total |
| Type | Positive | Priority | P1 |
| Steps | 1. Fill all 3 fields with valid data. 2. Continue to the overview step. |
| Expected | `Item total + Tax == Total`, all rendered as valid currency amounts. |
| Automated | `checkout.spec.ts` → TC-EX2-CHK-04 |

| ID | TC-EX2-CHK-05 |
|---|---|
| Title | Completing checkout shows a confirmation and empties the cart |
| Type | Positive | Priority | P1 |
| Steps | 1. From the overview step, click Finish. |
| Expected | "Thank you for your order!" confirmation is shown; cart badge disappears (0 items). |
| Automated | `checkout.spec.ts` → TC-EX2-CHK-05 |

### Responsive Behavior (375px)

| ID | TC-EX2-RESP-01 |
|---|---|
| Title | The login page has no horizontal overflow at 375px |
| Type | Usability | Priority | P2 |
| Steps | 1. Load the login page at a 375px viewport. 2. Compare `document.documentElement.scrollWidth` to 375. |
| Expected | No horizontal scroll (`scrollWidth <= 375`). |
| Automated | `responsive.spec.ts` → TC-EX2-RESP-01 |

| ID | TC-EX2-RESP-02 |
|---|---|
| Title | The hamburger menu opens and exposes navigation links on mobile |
| Type | Positive | Priority | P2 |
| Steps | 1. Log in at 375px. 2. Open the hamburger menu. |
| Expected | Menu shows "Logout" and "Reset App State" (among others). |
| Automated | `responsive.spec.ts` → TC-EX2-RESP-02 |

| ID | TC-EX2-RESP-03 |
|---|---|
| Title | The full purchase flow completes at 375px with no horizontal overflow at any step |
| Type | Positive | Priority | P1 |
| Steps | 1. Log in, add a product, go to cart, checkout, fill info, finish — all at 375px, checking `scrollWidth` at each step. |
| Expected | No overflow at any step; order completes normally. |
| Automated | `responsive.spec.ts` → TC-EX2-RESP-03 |

| ID | TC-EX2-RESP-04 |
|---|---|
| Title | Product card description height should be proportional to its content at 375px |
| Type | Usability | Priority | P3 |
| Steps | 1. Log in at 375px. 2. Measure the bounding-box height of the first product's `.inventory_item_description`. |
| Expected | Height under ~300px (content-proportional, similar to the desktop layout). |
| Actual | **Fails — BUG-EX2-006.** Found via visual review — the description block is stretched to ~496px (sized for the desktop grid), leaving large empty gaps and roughly doubling the page's scroll length on mobile. |
| Automated | `responsive.spec.ts` → TC-EX2-RESP-04 (documented as expected-fail via `test.fail()`) |

### Known Issues (seeded test accounts & visual review)

| ID | TC-EX2-BUG-01 | TC-EX2-BUG-02 | TC-EX2-BUG-03 | TC-EX2-BUG-04 | TC-EX2-BUG-05 | TC-EX2-BUG-06 | TC-EX2-BUG-07 | TC-EX2-BUG-08 |
|---|---|---|---|---|---|---|---|---|
| Title | `problem_user` product images should be distinct | `problem_user` price sort should reorder the list | `problem_user` should be able to type a Last Name | `performance_glitch_user` login shouldn't be dramatically slower | Logout should clear the cart | `visual_user` should see real catalog prices | `visual_user` product names should align consistently | `error_user` should be able to add every product to the cart |
| Type | Negative | Negative | Negative | Negative (perf) | Negative | Negative | Negative (visual) | Negative |
| Priority | P2 | P2 | P1 | P3 | P2 | P1 | P3 | P2 |
| Expected vs Actual | See `bug-board.md` for full repro steps and evidence for BUG-EX2-001 through BUG-EX2-009 (BUG-EX2-006 is covered above as TC-EX2-RESP-04). | | | | | | | |
| Automated | `known-issues.spec.ts` → TC-EX2-BUG-01..08 (all documented as expected-fail via `test.fail()`) | | | | | | | |

*`visual_user` and `error_user` were added to scope after a visual review of the login page showed all 6 seeded accounts (not just the 4 originally tested) — see `qa-planning.md` and `docs/ai-usage-report.md` §6.*
