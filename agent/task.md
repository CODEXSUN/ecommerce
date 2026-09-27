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
