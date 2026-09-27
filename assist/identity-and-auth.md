# Ecommerce Identity and Authentication Rules

This document defines the mandatory identity, authentication, migration, and seed contract for this application.

## Login desks

The web host must expose these paths:

- `/sa/login` accepts only the `super-admin` role.
- `/admin/login` accepts `admin` and approved developer permissions.
- `/login` accepts normal `user` and staff accounts.

These are separate desks. Do not merge them into one role-switching login screen or allow a successful login to bypass the requested desk.

## Platform ownership

Platform owns identity users, roles, permissions, password hashing, sessions, browser-session isolation, rate limits, password reset, and identity audit events. This application owns only its application-specific permissions and module authorization.

Use public Platform exports:

- `ensureLocalIdentityEnvironment`
- `LocalIdentityStore`
- `registerIdentityAuthRoutes`
- `registerIdentityManagementRoutes`

Do not copy identity tables, password hashing, JWT signing, or session logic into this repository.

## Migration and seed contract

API startup must:

1. Resolve the application SQLite path under `storage/apps/<app>/private/data/`.
2. Create or load the Platform identity store.
3. Run the forward, repeatable identity migrations.
4. Seed exactly one protected super-admin, one admin/developer account, and one staff/user account in development when seed values are configured or generated.
5. Never seed development credentials in production.
6. Fail production startup when the identity database or migration record is missing or invalid.

Seeds must be idempotent. Never commit `.env`, passwords, JWT secrets, SQLite files, or generated runtime data.

## Session and route security

Login requests require a valid `x-codexsun-browser-session` UUID. Authenticated requests use the Platform bearer token and the same browser-session binding. Logout revokes the server-side session. Failed logins are rate-limited and recorded in the identity audit trail.

A route must derive tenant and authorization scope from the verified server actor. Never trust role, tenant, or permission values from browser request bodies.

## Verification gate

Before handoff, run:

```powershell
npm run check
npm run build
npm test
```

Also verify each desk with valid and invalid role credentials, confirm migration repeatability, confirm all three seed roles, and report static, database, browser, and live API evidence separately.

