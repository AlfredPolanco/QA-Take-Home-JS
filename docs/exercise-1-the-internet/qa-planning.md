# QA Planning Sheet — Exercise 1: Exploratory & Functional Testing

**Target:** https://the-internet.herokuapp.com/
**Modules in scope:** Form Authentication (`/login`), Dynamic Loading (`/dynamic_loading/1`, `/2`), File Upload (`/upload`), Dropdown (`/dropdown`)
**Author:** Alfred Polanco (QA) — Claude Code assisted (see `docs/ai-usage-report.md`)
**Date:** 2026-07-07

## 1. Objective

Validate the functional correctness and usability of four independent training modules, and identify real, reproducible functional/usability defects through structured exploratory and scripted testing.

## 2. Scope

### In scope
- Form Authentication: valid/invalid login, empty submission, logout, direct URL access to the protected page, back-button behavior after logout.
- Dynamic Loading: Example 1 (element hidden via CSS) and Example 2 (element added to DOM after load).
- File Upload: successful upload, uploading with no file selected, upload confirmation content.
- Dropdown: default state, each selectable option.
- Cross-module navigation, since it's called out explicitly in the assignment's requirements.

### Out of scope
- The other ~40 modules on the-internet.herokuapp.com (e.g. Drag and Drop, JavaScript Alerts, iFrames) — not part of the assigned scope.
- Load/performance testing, penetration testing, and full WCAG accessibility audits (only surface-level usability/accessibility observations are noted where they were found incidentally).
- Cross-browser matrix testing — this pass and the automation suite target Chromium only (see Risks).

## 3. Approach

1. **Live exploratory testing** — no bugs were assumed from prior knowledge of this well-known training site; every finding below was reproduced live against the real site on 2026-07-07 (see `evidence/` for screenshots and raw console output captured during the session).
2. **Scripted functional test cases** — derived from the requirements doc, covering the documented happy paths and the negative/edge cases exploratory testing is best at surfacing (empty input, direct deep-linking, browser navigation).
3. **Automation** — the same functional cases are encoded as an executable Playwright + TypeScript (POM) suite in `automation/tests/the-internet/`, so this isn't a one-time manual pass; see `automation/DOCS.html` for how to run it.
4. **Bug documentation** — every reproduced defect is logged in `bug-board.md` (Kanban-style, mirrors the Trello board structure) with severity, priority, steps, expected vs. actual, and a linked screenshot in `evidence/`.

## 4. Test Environment

| Item | Value |
|---|---|
| Application URL | https://the-internet.herokuapp.com |
| Browser | Chromium (Playwright-managed), 1280×800 desktop viewport |
| OS | macOS (local execution) |
| Test data | `tomsmith` / `SuperSecretPassword!` (documented site credentials), a plain-text sample file for uploads |
| Tooling | Playwright Test 1.61, TypeScript, manual exploratory scripts for the initial investigation pass |

## 5. Risks & Assumptions

| Risk | Impact | Mitigation |
|---|---|---|
| The app is a public shared demo instance — state (uploaded files, sessions) is not persisted or isolated per tester. | Low | Tests don't depend on state left by other users; each test creates and cleans up its own preconditions (fresh login, fresh navigation). |
| Single-browser (Chromium) coverage only. | Medium | Documented as an explicit scope limitation; the app is server-rendered with minimal client JS, so cross-browser risk is lower than for a JS-heavy SPA. |
| The site may change without notice (it's a public OSS project). | Medium | The `healer` Claude Code subagent (`.claude/agents/healer.md`) is set up specifically to re-diagnose and fix broken locators if the DOM changes. |
| "Navigation must remain accessible across modules" is a stated requirement but the site provides no in-page breadcrumbs. | High (drove a bug) | Tested explicitly and reported as BUG-EX1-003 rather than silently assumed. |

## 6. Entry / Exit Criteria

**Entry:** Requirements doc reviewed; target site reachable; test data available.
**Exit:** All planned test cases for Form Authentication and File Upload (mandatory) plus Dynamic Loading and Dropdown (scope) executed at least once; minimum 5 bugs logged with evidence (achieved: 7); automation suite green (`npm test` exit code 0) with known bugs represented as documented expected-fail tests.

## 7. Deliverables

- This planning sheet, `test-cases.md`, `test-run-report.md`, `bug-board.md` (this folder) — also mirrored into the Google Sheet workbook.
- Screenshot evidence in `evidence/`.
- Automation suite: `automation/tests/the-internet/*.spec.ts`.
