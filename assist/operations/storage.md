# Ecommerce Storage

Ecommerce uses repository-local private storage for local development.

## Default path

The default SQLite path is `storage/apps/ecommerce/private/data/ecommerce_db.sqlite`.

Set `ECOMMERCE_DATABASE_PATH` to use another path for a test or deployment.

## Rules

- Keep database files ignored.
- Keep `.gitkeep` in the data directory.
- Back up a database before migration or replacement.
- Do not share application data with another repository.
