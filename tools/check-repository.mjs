import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const required = ["AGENTS.md", "assist/README.md", "assist/architecture.md", "assist/operations/infrastructure.md", "assist/operations/storage.md", "assist/execution/verification.md", "storage/README.md", "storage/apps/ecommerce/private/data/.gitkeep", "api/package.json", "web/package.json"];
for (const file of required) if (!existsSync(resolve(root, file))) throw new Error(`Missing required Ecommerce file: ${file}`);
if (packageJson.workspaces?.join(",") !== "api,web") throw new Error("Ecommerce workspaces must be api and web.");
console.log("Ecommerce repository layout is valid.");
