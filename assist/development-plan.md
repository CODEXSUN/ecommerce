# Ecommerce Developer Plan

This plan controls application work and shared-package proposals.

## Prepare

- [ ] Read `AGENTS.md` and the relevant Assist module guidance.
- [ ] Confirm the feature owner and affected bounded context.
- [ ] Check public Framework, Platform Core, Contracts, Core, and UI exports.

## Build

- [ ] Keep business behavior inside the owning Ecommerce module.
- [ ] Reuse public shared exports.
- [ ] Put missing shared candidates under `packages/shared/<owner>/`.
- [ ] Mark every candidate `pending-approval`.

## Verify and approve

- [ ] Add focused tests and a usage example.
- [ ] Run typecheck, lint, build, and relevant E2E checks.
- [ ] Submit the proposal API, owner, reuse evidence, tests, and migration path.
- [ ] Wait for explicit approval before changing an owner repository.
- [ ] Do not merge or publish shared-package candidates without approval.
