# CODEXSUN Ecommerce Agent Rules

These rules define the safe working boundary for the standalone Ecommerce repository.

## Repository boundary

- Work inside `E:\codexsun\ecommerce`.
- Use `E:\codexsun\framework`, `E:\codexsun\platform`, `E:\codexsun\ui`, and `E:\codexsun\core` only as approved sibling package sources.
- Do not edit the main repository or another application repository from an Ecommerce task.
- Keep secrets in ignored environment files.
- Do not commit database files, runtime deployments, backups, or generated build output.

## Shared package rule

- Reuse public exports from `@codexsun/ui`, Framework, Platform Core, Contracts, and Core.
- Do not copy shared components, blocks, helpers, or contracts into application modules.
- If a required shared capability is missing, prepare a proposal under `packages/shared/<owner>/`.
- Use `packages/shared/ui/` for missing UI components or blocks.
- Treat proposal files as application-local work. Do not publish or merge them into an owner repository without explicit approval.
- Record the proposed public API, ownership, tests, and migration path before requesting approval.

## Ownership

- The API owns Ecommerce routes, modules, migrations, and database access.
- The web host owns the Ecommerce user interface.
- Shared framework, platform, contracts, and UI behavior belongs in their owner repositories.
- `storage/` documents the runtime storage layout. Runtime data stays ignored.
- `tools/` owns repository checks and local development helpers.

## Required workflow

1. Read `assist/README.md` and the relevant module README before editing.
2. Keep each change inside its owning area.
3. Update documentation when behavior, storage, deployment, or contracts change.
4. Run `npm run verify` before handoff.
5. Commit and push only from this repository.
6. Keep shared-package proposals separate from production imports until approval.

## Database safety

Use `ECOMMERCE_DATABASE_PATH` for an alternate database in tests or deployments. Do not remove or replace a database without explicit approval and a verified backup.
