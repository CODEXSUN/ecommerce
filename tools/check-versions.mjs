import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const rootVersion = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version;
for (const workspace of ["api", "web"]) {
  const version = JSON.parse(readFileSync(resolve(root, workspace, "package.json"), "utf8")).version;
  if (version !== rootVersion) throw new Error(`${workspace} version ${version} does not match root ${rootVersion}.`);
}
console.log(`Ecommerce version alignment is valid: v-${rootVersion}.`);
