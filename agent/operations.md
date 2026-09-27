# Ecommerce Agent Operations

This document records safe operating rules for work in the Ecommerce checkout.

## Boundary

- Work only in `E:\codexsun\ecommerce`.
- Before repository commands, confirm `Get-Location` and `git rev-parse --show-toplevel`.
- Read sibling repositories only when required to inspect public exports. Never write to them.
- Preserve unrelated changes. Do not delete, reset, switch branches, force-push, commit, or push during preparation.

## Shared packages

Use public exports from Framework, Platform Core, Core Contracts, and UI. Missing capabilities are application-local proposals under `packages/shared/<owner>/`, marked `pending-approval`, with API, owner, reuse evidence, tests, documentation, and migration path. Do not import proposals as hidden runtime dependencies.

## Runtime and storage

- Keep credentials in ignored environment files.
- Use `ECOMMERCE_DATABASE_PATH` for alternate databases.
- Default SQLite path: `storage/apps/ecommerce/private/data/ecommerce_db.sqlite`.
- Back up before migration or replacement; never remove or replace runtime data without explicit approval.
- Keep local services on loopback.

## Verification

Run static checks from the repository root. Report static and live evidence separately. Full handoff requires `npm run verify` plus applicable loopback API, web, database, backup/restore, and composed E2E checks.
