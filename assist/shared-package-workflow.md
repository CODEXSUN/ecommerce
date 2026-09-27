# Ecommerce Shared Package Workflow

This document defines how Ecommerce uses shared packages and prepares missing capabilities for approval.

## Reuse first

Use public exports from `@codexsun/ui`, Framework, Platform Core, Contracts, and Core. Check the owner repository and its public entry points before creating local code.

## Proposal area

Use these application-local folders for proposal work:

- `packages/shared/ui/` for UI components and blocks.
- `packages/shared/framework/` for Framework helpers.
- `packages/shared/platform/` for Platform adapters or contracts.
- `packages/shared/core/` for shared master data or domain-neutral helpers.
- `packages/shared/contracts/` for cross-application contracts.

These folders are staging areas. They are not owner libraries and must not become hidden runtime dependencies.

## Approval gate

Before promotion, include the proposed API, owner repository, reuse evidence, tests, documentation, and migration path. A developer must not merge or publish the proposal without explicit approval.

## Developer task flow

1. Search the public shared package exports.
2. Record why the existing exports do not meet the need.
3. Add the smallest proposal under the matching `packages/shared/` folder.
4. Add focused tests and a usage example.
5. Mark the proposal as `pending-approval`.
6. Wait for approval before changing an owner repository or promoting the proposal.
