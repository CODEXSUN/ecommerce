# Ecommerce Active Task

## Audit result

The repository audit is complete. The checkout is clean on `main` and the Git root is exactly `E:\codexsun\ecommerce`.

Passed read-only checks:

- `npm run check`
- `npm test`
- `npm run lint` (current baseline placeholder)
- `npm run check:versions`
- `npm run check:repository`

The API has only a JWT bootstrap, storage-path helper, application metadata, and one bootstrap test. The web entry is a null placeholder. No business modules, HTTP runtime, migrations, or live services are present.

## First approved implementation task

**TASK-000 — Create and maintain the Ecommerce agent process folder and record the audit.**

- Owner: Repository process.
- Status: complete.
- Scope: `agent/` only; no business code, shared owner repository, generated output, runtime data, or secrets.
- Dependencies: required repository and Assist guidance.
- Acceptance criteria:
  - All requested process files exist.
  - The nine phases have numbered tasks, owners, statuses, dependencies, acceptance criteria, static checks, live checks, and blockers.
  - The first product implementation remains pending approval in Phase 4.
  - Unrelated changes are preserved.
- Static evidence: read-only check and test baseline passed; repository remains clean before this process-only change.
- Live evidence: not applicable; no services exist.
- Blockers: changelog filename is `assist/documentation/CHAGELOG.md`, while the requested name is `CHANGELOG.md`; no HTTP runtime exists.

## Completed implementation

**TASK-001 — API, web, storage, authentication, and commerce foundation.**

- Owner: API, Web, Contracts, Storage.
- Status: complete for v0.1 foundation.
- Delivered: local commerce contracts, SQLite migration/seed baseline, catalog endpoints, JWT-protected cart/order endpoints, atomic inventory decrement, order history, loopback API server, shared UI storefront composition, and high-fidelity loopback storefront host.
- Static evidence: `npm run check`, `npm test`, `npm run build`, `npm run lint`, `npm run check:versions`, `npm run check:repository`, and `git diff --check` pass.
- Live evidence: API health, Platform health, catalog listing, operator JWT, cart mutation, order placement, and web HTTP 200 were verified on ports 6230 and 6231.
- Scope boundary: no sibling repository was modified; runtime SQLite remains under ignored `storage/`.

## Remaining scale work

Customer identity and refresh sessions, payments, fulfillment, pricing/promotions, external integration adapters, MariaDB deployment, observability, backup/restore, and browser automation remain follow-up scope.

## Next task requiring approval

**TASK-002 — Customer identity and checkout hardening.** Add customer login/session flows, payment-provider boundary contracts, and a browser-level checkout E2E without changing shared owner repositories.

## Completed operational task

**TASK-003 — Prevent duplicate Ecommerce dev launches.**

- Owner: Developer experience and runtime operations.
- Status: complete.
- Scope: `tools/dev-ecommerce.mjs` and process documentation only.
- Dependencies: existing `dev:api` and `dev:web` scripts, API port `6230`, and web port `6231`.
- Acceptance criteria:
  - The supervisor checks configured API and web ports before spawning children.
  - A duplicate launch exits with a clear service/port message and does not spawn children.
  - A clean launch still starts both services and shuts down together.
  - Existing Ecommerce processes are not terminated automatically by the guard.
- Static checks: `npm run check`, `npm test`, and `git diff --check` pass.
- Live checks: clean launch returned API `302` to `http://127.0.0.1:6231/`; web returned `200`; duplicate launch returned exit code `1` with both occupied ports listed.
- Blockers: none.

## Planned clone-and-work task

**TASK-004 — Clone and prepare Ecommerce v0.1.1 for continued work.**

- Owner: Repository setup and developer experience.
- Status: planned.
- Scope: clone setup, dependency preparation, runtime verification, and process handoff. Do not modify sibling repositories or shared owner repositories.
- Dependencies: Ecommerce v0.1.1, an approved destination path, and explicit approval before implementation begins.
- Acceptance criteria:
  - The cloned checkout has the expected Git root and preserved branch state.
  - All workspace versions match `0.1.1`.
  - Dependencies install and static checks pass.
  - API `6230` redirects to web `6231`, and the landing page returns `200`.
  - The next bounded-context task is recorded before code changes start.
- Static checks: `npm run check`, `npm run build`, `npm test`, `npm run check:versions`, `npm run check:repository`, and `git diff --check`.
- Live checks: `npm run dev:ecommerce`, API redirect, web response, catalog response, and duplicate-launch guard.
- Blockers: destination path and source clone details need operator approval.

## Completed fork-delivery task

**TASK-005 — Make GitHub delivery work from the main repository and developer forks.**

- Owner: Developer experience and release operations.
- Status: complete.
- Scope: `tools/github-now.mjs`, delivery documentation, version metadata, and process logs.
- Dependencies: a clean Git tree, a named branch, and a GitHub `origin` remote.
- Acceptance criteria:
  - HTTPS and SSH GitHub origins are accepted.
  - Non-GitHub origins are rejected.
  - `--dry-run` validates without pushing.
  - Normal execution pushes the current branch to `origin`.
  - The main Ecommerce remote passes the delivery command.
- Static checks: `npm run check`, `npm test`, `npm run build`, `npm run check:versions`, `npm run check:repository`, and `git diff --check`.
- Live checks: `npm run github:now -- --dry-run` and `npm run github:now`.
- Blockers: developer fork verification remains pending until a fork URL and write access exist.

## TASK-IDENTITY-001: Run live end-to-end login tests for all apps

- Status: pending.
- Owner: Identity and verification.
- Scope: Ecommerce and its local runtime only during this app run.
- Prompt: Inspect, implement, and test `/sa/login` for super-admin, `/admin/login` for admin and developer, and `/login` for staff and user. Repeat the same task in every app repository in scope.
- Required checks: read the identity rule book, verify the Git root, verify Platform bootstrap and route registration, verify migrations and seeds, test successful and wrong-desk login, test invalid credentials, test browser-session binding, test `/me`, test logout revocation, test rate limits and audit records, verify production guards, and verify web redirects.
- Static evidence: typecheck, build, unit tests, migration tests, and boundary checks.
- Live evidence: API health, all three login desks, protected request, logout, and audit record.
- Blockers: preserve the existing unrelated Ecommerce changes and record exact host or dependency failures.
- Handoff: update `agent/plan.md`, this task register, and the identity changelog before commit.
