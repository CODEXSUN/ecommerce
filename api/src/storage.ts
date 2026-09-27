import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export function applicationDatabasePath(applicationId: string, environment: NodeJS.ProcessEnv = process.env): string {
  if (!/^[a-z][a-z0-9-]*$/u.test(applicationId)) throw new Error("Application ID must be a lowercase slug.");
  const environmentKey = applicationId.replaceAll("-", "_").toUpperCase() + "_DATABASE_PATH";
  const configuredPath = environment[environmentKey]?.trim();
  const databasePath = configuredPath
    ? resolve(import.meta.dirname, "..", "..", configuredPath)
    : resolve(import.meta.dirname, "..", "..", "storage", "apps", applicationId, "private", "data", applicationId + "_db.sqlite");
  mkdirSync(dirname(databasePath), { recursive: true });
  return databasePath;
}
