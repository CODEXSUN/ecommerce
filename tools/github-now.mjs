import { execFileSync } from "node:child_process";

const dryRun = process.argv.includes("--dry-run");
const run = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const branch = run(["branch", "--show-current"]);
const remote = run(["remote", "get-url", "origin"]);
const status = run(["status", "--short"]);
if (!branch) throw new Error("A named branch is required for GitHub delivery.");
if (!isGithubRemote(remote)) throw new Error(`Origin must point to a GitHub repository: ${remote}`);
if (status) throw new Error("Working tree is not clean.");
console.log(`GitHub delivery check passed for ${branch} -> ${remote}.`);
if (!dryRun) {
  execFileSync("git", ["push", "origin", branch], { stdio: "inherit" });
  console.log(`Pushed ${branch} to origin.`);
}

function isGithubRemote(value) {
  return /^(?:https?:\/\/github\.com\/|git@github\.com:)[^/]+\/[^/]+(?:\.git)?$/i.test(value);
}
