# Ecommerce Agent Changelog

This log records process and implementation-task changes for the Ecommerce checkout.

## 2026-09-27

- Bumped the aligned Ecommerce release to `0.1.3`.
- Recorded commit format `#<number> - <short description>` in the release log.
- Recorded `#28 - Record GitHub fork delivery and release convention` in the application changelog.
- Bumped the aligned Ecommerce release to `0.1.2`.
- Updated `github:now` to support HTTPS and SSH GitHub origins, dry-run validation, and branch push from the main repository or a developer fork.
- Added Phase 12 and TASK-005 for GitHub fork delivery.
- Bumped the aligned Ecommerce release to `0.1.1` for clone-and-work handoff.
- Updated the version-bump workflow to include the contracts workspace and refreshed the lockfile.
- Added Phase 11 for clone setup, dependency preparation, handoff verification, and approval before the next bounded-context task.
- Added TASK-004 as the planned clone-and-work task.
- Added the controlled `agent/` process folder after the read-only repository and Assist audit.
- Recorded the first approved task as process-control setup, completed without business-code changes.
- Recorded TASK-001 API foundation as pending approval.
- Recorded the existing `CHAGELOG.md` versus requested `CHANGELOG.md` filename mismatch as a documentation blocker.
- Implemented the v0.1 API/web foundation: SQLite catalog seed, commerce contracts, catalog/cart/order routes, JWT-protected checkout, and loopback servers.
- Added the shared UI EcommerceHeader/ProductCard composition and a responsive Aurelia Market storefront.
- Verified static checks and a live catalog → cart → order smoke flow.
- Added API-root welcome redirect to the frontend with configurable `ECOMMERCE_WEB_URL`.
- Added root `dev:api`, `dev:web`, and supervised `dev:ecommerce` commands.
- Added and visually verified the first landing page with API-backed featured products and responsive structure.
- Added Ecommerce dev-port preflight so duplicate launches report occupied API/web ports before spawning child processes.
- Verified a clean combined launch, API-to-web redirect, web `200` response, and duplicate-launch failure behavior.
