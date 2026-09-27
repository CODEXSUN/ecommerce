# Ecommerce Tools

These tools check the repository, validate package versions, inspect local ports, and show the GitHub delivery state.

## Commands

- `npm run preflight -- ecommerce-api --check` checks the API port.
- `npm run preflight -- ecommerce-web --check` checks the web port.
- `npm run dev:api` starts the API on loopback port 6230.
- `npm run dev:web` starts the web host on loopback port 6231.
- `npm run dev:ecommerce` checks ports 6230/6231, supervises both development services, and stops them together. If either port is occupied, it exits with the service and port instead of starting a duplicate stack.
- `npm run check:repository` checks required files and repository identity.
- `npm run check:versions` checks workspace version alignment.
- `npm run github:now -- --dry-run` checks the current branch, clean tree, and GitHub `origin` without pushing.
- `npm run github:now` checks the same delivery rules and pushes the current branch to `origin`. This works for the main repository and developer forks.
- `npm run version:bump -- --title "change title" --no-database-update` updates the version and change log.
