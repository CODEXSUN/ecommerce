import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const titleIndex = process.argv.indexOf("--title");
const title = titleIndex >= 0 ? process.argv[titleIndex + 1] : "Foundation update";
const packagePath = resolve(process.cwd(), "package.json");
const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const [major, minor, patch] = packageJson.version.split(".").map(Number);
const next = `${major}.${minor}.${patch + 1}`;
packageJson.version = next;
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
for (const workspace of ["contracts", "api", "web"]) {
  const path = resolve(process.cwd(), workspace, "package.json");
  const value = JSON.parse(readFileSync(path, "utf8"));
  value.version = next;
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}
const logPath = resolve(process.cwd(), "assist", "documentation", "CHAGELOG.md");
const log = readFileSync(logPath, "utf8");
writeFileSync(logPath, `# Ecommerce Change Log\n\nThis log records repository foundation changes.\n\n## ${next}\n\n- ${title}\n\n${log.replace(/^# Ecommerce Change Log\n\nThis log records repository foundation changes\.\n\n/, "").replace(/^## 0\.1\.0/m, "### 0.1.0")}`);
console.log(`Bumped Ecommerce to v-${next}.`);
