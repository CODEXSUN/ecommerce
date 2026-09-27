# Ecommerce Work Plan

This plan tracks the Ecommerce audit and implementation sequence. Owners are repository areas, not individual agents.

## Phase 1: Repository and Assist review

- [x] 1.1 Read repository boundary and safety rules. Owner: Repository. Status: complete. Dependencies: none. Acceptance: `AGENTS.md` read and write boundary confirmed. Static checks: repository root and status inspected. Live checks: none. Blockers: none.
- [x] 1.2 Read Assist architecture, package workflow, development, operations, and verification guidance. Owner: Assist. Status: complete. Dependencies: 1.1. Acceptance: required guidance reviewed. Static checks: all requested files present except the documented changelog filename mismatch. Live checks: none. Blockers: `assist/documentation/CHAGELOG.md` exists instead of `CHANGELOG.md`.

## Phase 2: Architecture and module ownership

- [x] 2.1 Confirm API/web/storage/tool ownership. Owner: Architecture. Status: complete. Dependencies: Phase 1. Acceptance: API owns routes and persistence; web owns UI; storage owns runtime layout; tools own checks. Static checks: source tree inspected. Live checks: none. Blockers: no business modules exist yet.
- [x] 2.2 Confirm Ecommerce bounded-context boundaries. Owner: Ecommerce modules. Status: complete. Dependencies: 2.1. Acceptance: catalog, pricing, cart, order, fulfillment, customer, and integrations remain separate. Static checks: Assist guidance reviewed. Live checks: none. Blockers: module implementation is pending.

## Phase 3: Framework, Platform, Core, Contracts, and UI reuse audit

- [x] 3.1 Inspect public sibling exports. Owner: Shared boundaries. Status: complete. Dependencies: Phase 2. Acceptance: only public package exports are identified for reuse. Static checks: Framework, Platform Core, Core Contracts, and UI entry points inspected. Live checks: none. Blockers: sibling promotion is outside this repository and requires approval.
- [x] 3.2 Record local proposal policy. Owner: Shared boundaries. Status: complete. Dependencies: 3.1. Acceptance: missing capabilities use `packages/shared/<owner>/` and are marked pending-approval. Static checks: proposal README files present. Live checks: none. Blockers: no proposal is approved or required yet.

## Phase 4: API and web foundation

- [x] 4.1 Define and implement the smallest API application boundary and health contract using public Platform/Core Contracts exports. Owner: API. Status: complete. Dependencies: Phases 1-3. Acceptance: loopback server, `/healthz`, Platform health, catalog, cart, and order routes exist without business-module leakage. Static checks: check, typecheck, test, build pass. Live checks: health and API smoke flow pass. Blockers: production deployment adapter remains future work.
- [x] 4.2 Define the web host bootstrap and shared UI consumption boundary. Owner: Web. Status: complete. Dependencies: 4.1 and public UI audit. Acceptance: web entry uses public Ecommerce header and ProductCard exports; high-fidelity storefront loads from loopback. Static checks: typecheck and build pass. Live checks: HTTP 200 and hero content verified. Blockers: bundler/CDN deployment is future work; current host is an intentionally small loopback renderer.

## Phase 5: Storage and migration readiness

- [x] 5.1 Define database provider configuration and migration baseline. Owner: API/Storage. Status: complete. Dependencies: 4.1. Acceptance: default and override paths follow Assist storage rules; runtime data remains ignored; schema migration and idempotent seed run at startup. Static checks: API E2E test passes against an isolated SQLite file. Live checks: live catalog/cart/order flow used a separate runtime database. Blockers: MariaDB adapter and backup automation remain future work.

## Phase 6: Authentication and first-boot JWT

- [x] 6.1 Integrate development JWT bootstrap and production secret enforcement through public Platform exports. Owner: API/Platform boundary. Status: complete for the foundation slice. Dependencies: 4.1 and 5.1. Acceptance: existing development values remain unchanged, missing development values are generated in ignored `.env`, production bootstrap remains guarded, and protected commerce routes verify bearer JWTs. Static checks: bootstrap and API tests pass. Live checks: operator token authenticated cart and order requests. Blockers: customer identity screens and refresh-token sessions remain future work.

## Phase 7: Ecommerce module planning

- [x] 7.1 Approve the first bounded context and its public contract. Owner: Ecommerce module owner. Status: complete for v0.1 commerce foundation. Dependencies: Phases 4-6. Acceptance: catalog, cart, and order responsibilities are explicit; product availability, inventory, cart totals, atomic order placement, and order status invariants are enforced; JSON contracts are published under `contracts/`. Static checks: contract and API tests pass. Live checks: catalog → authenticated cart → placed order passes. Blockers: pricing, fulfillment, customer, and integration modules remain planned next slices.

## Phase 8: Tests and verification

- [x] 8.1 Add focused static and live verification for each implemented capability. Owner: Verification. Status: complete for v0.1 foundation. Dependencies: Phases 4-7. Acceptance: static baseline and composed smoke evidence are recorded separately. Static checks: check, test, lint, build, versions, repository, and diff-check pass. Live checks: API health, Platform health, six seeded products, JWT cart mutation, order placement, and web HTTP 200 pass. Blockers: backup/restore and external-provider E2E are not yet implemented.

## Phase 9: Developer handoff

- [x] 9.1 Review evidence, blockers, docs, and ownership before handoff. Owner: Handoff. Status: complete for v0.1 foundation. Dependencies: Phase 8. Acceptance: no sibling repository was changed, runtime data is ignored, process records are current, and remaining scale gaps are explicit. Static checks: final verification recorded. Live checks: composed smoke recorded. Blockers: production deployment, customer identity, payment, fulfillment, and external integration are follow-up scope.

## Phase 10: Live identity and authentication

- [ ] 10.1 Run live end-to-end login tests for all apps. Owner: Identity and verification. Status: pending. Dependencies: Platform identity routes, Ecommerce identity bootstrap, and development seed configuration. Acceptance: Ecommerce proves `/sa/login`, `/admin/login`, and `/login` with valid and invalid role credentials. Static checks: typecheck, build, and unit tests pass. Live checks: API health, login success, wrong-desk denial, session-bound `/me`, logout revocation, rate limiting, and identity audit events pass. Blockers: the existing Ecommerce working tree contains unrelated in-progress changes. Preserve them and record any host blocker.

### Agent execution prompt

Run this task in every application repository in scope: Accounts, Auditor, Billing, Ecommerce, Garments, HIMSX, HRMS, LMS, CRM, and Q Cafe. Read `AGENTS.md`, `assist/README.md`, and `assist/identity-and-auth.md`. Verify the Git root before every command. Inspect and implement missing Platform identity route wiring. Test the three login desks, wrong-desk denial, invalid credentials, browser-session binding, `/me`, logout, rate limits, audit records, migrations, repeat-safe seeds, production guards, and web redirects. Use public Platform exports only. Keep static and live evidence separate. Do not edit sibling repositories, shared owner packages, runtime data, generated output, or secrets.

## Phase 11: Clone and work handoff

- [ ] 11.1 Clone the Ecommerce checkout into an approved workspace. Owner: Repository setup. Status: planned. Dependencies: 9.1 and release version `0.1.1`. Acceptance: the clone uses the Ecommerce repository, preserves the current branch state, and does not modify sibling repositories. Static checks: verify the clone root and `git status`. Live checks: none. Blockers: the destination path and clone source require an explicit operator choice.
- [ ] 11.2 Install dependencies and prepare the local runtime. Owner: Developer experience. Status: planned. Dependencies: 11.1. Acceptance: `npm install` completes, shared local package links resolve, and ignored runtime storage remains outside source control. Static checks: `npm run check`, `npm run build`, and `npm run check:versions`. Live checks: `npm run dev:ecommerce` starts API `6230` and web `6231`. Blockers: host Node/npm versions or missing sibling packages can block setup.
- [ ] 11.3 Run the Ecommerce handoff verification. Owner: Verification. Status: planned. Dependencies: 11.2. Acceptance: API root redirects to the web host, web root returns `200`, catalog data loads, and duplicate dev launches stop with a clear port message. Static checks: `npm test`, `npm run lint`, `npm run check:repository`, and `git diff --check`. Live checks: API health, web response, catalog request, and browser landing-page review. Blockers: external provider, payment, fulfillment, and production deployment checks remain out of scope.
- [ ] 11.4 Start the next bounded-context task after review. Owner: Ecommerce module owner. Status: planned. Dependencies: 11.3 and explicit approval. Acceptance: the selected task is recorded in `agent/task.md` with owner, dependencies, acceptance criteria, static checks, live checks, and blockers before implementation. Static checks: plan review. Live checks: task-specific. Blockers: no implementation starts until the task is approved.

## Phase 12: GitHub fork delivery

- [x] 12.1 Support delivery from the main repository and developer forks. Owner: Developer experience. Status: complete. Dependencies: Phase 11 and a clean Git checkout. Acceptance: `github:now --dry-run` accepts HTTPS or SSH GitHub origins, rejects non-GitHub origins, and normal delivery pushes the current branch to `origin`. Static checks: typecheck/build and delivery-script review. Live checks: dry-run and push from the Ecommerce origin. Blockers: GitHub credentials and branch permissions remain host-controlled.
- [ ] 12.2 Verify a developer fork. Owner: Repository setup. Status: planned. Dependencies: 12.1 and an approved fork. Acceptance: fork `origin` and current branch pass delivery checks without changing the upstream remote. Static checks: clean tree and repository checks. Live checks: dry-run, push, and remote branch confirmation. Blockers: a fork URL and write access are required.
