# Ecommerce Assist

## Module ownership and Vite recovery

Catalog, pricing, cart, order, fulfillment, and integrations remain separate vertical modules. Do not centralize sibling behavior in grouping registries, generic CRUD, shared forms, or dynamic path handlers. Vite chunk-load recovery may clear stale caches and retry one cache-busting reload, then must surface the build error; infinite reloads are forbidden.

## Architecture contract

Ecommerce is a DDD modular monolith. Catalog, pricing, cart, order, fulfillment, customer, and integration behavior is module-owned with explicit API/web roles, migrations, seeds, contracts, events, queues, sync, and tests. Composition registers only. Framework owns lifecycle; Platform owns tenancy/auth/storage/outbox/queues/observability; Core owns masters; UI owns primitives. Use public contracts/events, never private imports/direct sibling tables. Events carry tenant/actor/correlation/aggregate IDs. Queue slow/retryable/export/backup/sync work with idempotency and audit; sync declares source, target, cursor, conflicts, and status. Validate route/service/database. Keep files below 300 lines and never above 700. Use root npm, changelog sections, version tooling, `check:versions`, `github:now`, and `git:release`; commits `#<reference> - <title>`, tags `v-<version>`. Require lint, typecheck, boundaries, builds, dependency, migration/seed, and E2E checks.

Ecommerce is a modular monolith with DDD bounded contexts. Composition registers modules and lifecycle order only. Each module owns its domain model, invariants, validation, persistence, routes, migrations, seeds, public contract, web UI, tests, events, and worker/sync policy.

Ecommerce owns catalog, pricing, carts, orders, fulfillment, customer commerce, and integrations. Framework owns lifecycle; Platform owns tenant/auth/configuration/storage/outbox/queues/observability; Core owns shared masters; UI owns neutral controls. Use public contracts, lookups, commands, or events across boundaries; never private imports or direct sibling tables.

Facts are tenant-scoped events with actor and correlation IDs. Queue slow/retryable integration, export, backup, and sync work with idempotency and audit. Sync declares source, target, cursor, conflict policy, and observed status. Validate route input, service invariants, and database constraints. Migrations are forward/repeatable and seeds idempotent.

Keep files below 300 lines where practical and never above 700. Split API/web/domain responsibilities; no metadata-driven generic CRUD.

```text
api/src/modules/<name>/ migration types repository service routes events workers tests
web/src/modules/<name>/ schema services hooks form list show workspace tests
contracts/               stable public contracts
```

Use root npm. Every behavior change updates tests, Assist guidance, and `assist/documentation/CHANGELOG.md` (newest first; Database Changes/App Codebase Changes). Use version tooling, `check:versions`, `github:now`, and `git:release`; commit subjects are `#<reference> - <title>`, tags `v-<version>`. Never force-push. Completion requires lint, typechecks, boundaries, builds, dependency layout, migration/seed, and composed E2E checks with static/live results reported separately.
