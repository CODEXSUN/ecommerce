# Ecommerce Assist

This directory contains the active rules for Ecommerce development.

## Start here

Read `AGENTS.md`, then read `architecture.md`, `operations/infrastructure.md`, `operations/storage.md`, and `execution/verification.md`.

## Development boundary

Ecommerce owns business behavior only. Framework, Platform Core, Contracts, and UI remain external dependencies.

## Change rule

Keep API, web, contracts, storage, and tools changes in their owning area. Add a test and update the relevant document when behavior changes.
