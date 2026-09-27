# CODEXSUN Ecommerce Agent Rules

These rules define the safe working boundary for the standalone Ecommerce repository.

## Repository boundary

- Work inside `E:\codexsun\ecommerce`.
- Use `E:\codexsun\framework`, `E:\codexsun\platform`, `E:\codexsun\ui`, and `E:\codexsun\core` only as approved sibling package sources.
- Do not edit the main repository or another application repository from an Ecommerce task.
- Keep secrets in ignored environment files.
- Do not commit database files, runtime deployments, backups, or generated build output.

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

## Database safety

Use `ECOMMERCE_DATABASE_PATH` for an alternate database in tests or deployments. Do not remove or replace a database without explicit approval and a verified backup.
