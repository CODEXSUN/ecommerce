# Ecommerce Verification

Run these commands from the repository root before handoff.

```powershell
npm run check
npm test
npm run build
npm run lint
npm run check:versions
npm run check:repository
```

`npm run verify` runs the complete static baseline. Live API, web, database, backup, and deployment checks require the related feature to exist and must be reported separately.
