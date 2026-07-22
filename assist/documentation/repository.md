# CODEXSUN Ecommerce Repository Contract

## Nature

Installable ecommerce application boundary reserved for independently owned commerce modules.

## Ownership

Only the public ecommerce package contract currently present under `src/`.

Excluded ownership: Platform composition, Core/Billing/Mail behavior, framework infrastructure, and UI primitives.

## Current Structure

- `src/`

## Migration Contract

No database migrations exist. A future entity must add its migration inside its own ecommerce leaf module before the repository is registered for tenant provisioning.

## Seed Contract

No seeders exist. Future seeds must be deterministic, repeatable, and owned by the same leaf that owns the table.

## Environment Contract

No environment variables are owned. Future runtime configuration must be validated by the owning executable application; secrets must never enter frontend code.

## Composition Contract

This repository exposes intentional public package contracts. The `codexsun` repository is the executable composition root. It may install, register, order, build, and invoke exported lifecycle functions; it must not copy this repository's business implementation.

`src/index.ts` publishes the Ecommerce application-bundle manifest. App Operations reports it as a
connected boundary until this repository adds real module-owned runtime components.

## Required Checks

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run check:versions`
- `npm run github:now -- --dry-run`

Run composed boundary, database, and E2E checks from the sibling `codexsun` repository when the change affects runtime integration.
