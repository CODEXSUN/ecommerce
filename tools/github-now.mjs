import { execFileSync } from "node:child_process";

const dryRun = process.argv.includes("--dry-run");
const run = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const branch = run(["branch", "--show-current"]);
const remote = run(["remote", "get-url", "origin"]);
const status = run(["status", "--short"]);
if (remote !== "https://github.com/CODEXSUN/ecommerce.git") throw new Error(`Unexpected origin: ${remote}`);
if (status) throw new Error("Working tree is not clean.");
console.log(`GitHub delivery check passed for ${branch} -> ${remote}.`);
if (!dryRun) console.log("Push only after the owner reviews the commit and requests delivery.");
