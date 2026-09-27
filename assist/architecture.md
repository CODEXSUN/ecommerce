# Ecommerce Architecture

Ecommerce is a standalone application repository with separate API and web workspaces.

## Ownership

- `api/` owns server routes, business modules, migrations, and database access.
- `web/` owns the browser application and user flows.
- `contracts/` will own shared application contracts when the first cross-workspace contract is added.
- `storage/` owns the local runtime data layout.
- `tools/` owns repository checks and local development helpers.

## Dependency boundary

Use public exports from Framework, Platform Core, Contracts, and UI. Do not import private files from sibling repositories.
