# Ecommerce Tools

These tools check the repository, validate package versions, inspect local ports, and show the GitHub delivery state.

## Commands

- `npm run preflight -- ecommerce-api --check` checks the API port.
- `npm run preflight -- ecommerce-web --check` checks the web port.
- `npm run check:repository` checks required files and repository identity.
- `npm run check:versions` checks workspace version alignment.
- `npm run github:now -- --dry-run` checks the current branch and remote without pushing.
- `npm run version:bump -- --title "change title" --no-database-update` updates the version and change log.
