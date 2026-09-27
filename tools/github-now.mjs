#!/usr/bin/env node

import { execFileSync, execSync } from "node:child_process";
import { platform } from "node:os";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");

function run(command, options = {}) {
  const result = execSync(command, { cwd: ROOT, encoding: "utf8", stdio: options.silent ? "pipe" : "inherit", ...options });
  return result ? result.trim() : "";
}

function runGit(args, options = {}) {
  const result = execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: options.silent ? "pipe" : "inherit", ...options });
  return result ? result.trim() : "";
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (!dryRun) {
    console.log("\n  > npm.cmd run fix:line-endings");
    run("npm.cmd run fix:line-endings");
  }
  console.log("  > node tools/line-endings.mjs check");
  run("node tools/line-endings.mjs check");

  const branch = runGit(["branch", "--show-current"], { silent: true });
  const remote = runGit(["remote", "get-url", "origin"], { silent: true });
  let changelog = readLatestChangelogEntry();
  let defaultMessage = `#${changelog.reference} - ${changelog.title}`;
  const status = runGit(["status", "--porcelain"], { silent: true });
  const files = status ? status.split("\n").filter(Boolean) : [];

  if (!branch) throw new Error("A named branch is required for GitHub delivery.");
  if (!isGithubRemote(remote)) throw new Error(`Origin must point to a GitHub repository: ${remote}`);

  console.log(`\n  Changelog version: ${changelog.version}`);
  console.log(`  Commit subject:    ${defaultMessage}`);
  console.log(`  Uncommitted:       ${files.length} files\n`);
  for (const file of files) console.log(`    ${file}`);
  if (files.length > 0) console.log("");

  if (dryRun) {
    console.log(renderReviewBox(files.length, defaultMessage, changelog.version));
    console.log("  Dry run only. No pull, commit, or push was performed.\n");
    return;
  }

  const message = await withPrompt(async (ask) => {
    console.log(renderReviewBox(files.length, defaultMessage, changelog.version));
    const shouldBump = await ask(
      "  Bump next version before commit? [y/N]: ",
    );
    if (isYes(shouldBump)) {
      const titleAnswer = await ask("  Version title [version update]: ", "version update");
      const title = titleAnswer.trim() || "version update";
      await ask("  Does this version change database data or schema? [y/N]: ");
      const nextReference = changelog.reference + 1;
      execFileSync("npm.cmd", ["run", "version:bump", "--", "--title", `#${nextReference} - ${title}`], { cwd: ROOT, stdio: "inherit" });
      execFileSync("npm.cmd", ["install", "--package-lock-only", "--ignore-scripts"], { cwd: ROOT, stdio: "inherit" });
      changelog = readLatestChangelogEntry();
      defaultMessage = `#${changelog.reference} - ${changelog.title}`;
      console.log(`\n  Bumped to ${changelog.version}`);
      console.log(`  Commit subject: ${defaultMessage}\n`);
    }
    const answer = await ask(`  Commit message [${defaultMessage}]: `, defaultMessage);
    const subject = answer.trim() || defaultMessage;
    if (subject !== defaultMessage) throw new Error(`Commit subject must match ${defaultMessage}.`);
    const confirm = await ask("  Continue with pull, commit, and push? [y/N]: ");
    if (!isYes(confirm)) throw new Error("Cancelled.");
    return subject;
  });

  run("npm.cmd run check:versions");
  checkAndPull();
  run("node -e \"console.log('Ecommerce delivery checks passed.')\"");
  runGit(["add", "-A"]);
  runGit(["commit", "-m", message]);
  runGit(["push"]);
  console.log(`\n  Done - ${message}\n`);
}

function readLatestChangelogEntry() {
  const content = readFileSync(resolve(ROOT, "assist", "documentation", "CHAGELOG.md"), "utf8");
  const match = /^## (\d+\.\d+\.\d+)\s*\r?\n\r?\n- #(\d+) - (.+)$/mu.exec(content);
  if (!match) throw new Error("CHAGELOG.md does not contain a current #number - title entry.");
  return { version: match[1], reference: Number(match[2]), title: match[3].trim() };
}

function renderReviewBox(fileCount, subject, version) {
  const rows = ["GitHub Commit Review", `Version: ${version}`, `Subject: ${subject}`, `Files: ${fileCount}`];
  const width = Math.max(...rows.map((row) => row.length)) + 4;
  const border = `+${"-".repeat(width)}+`;
  return ["", border, ...rows.map((row) => `| ${row.padEnd(width - 2)} |`), border, ""].join("\n");
}

async function withPrompt(callback) {
  if (!process.stdin.isTTY && platform() === "win32") return callback(askWindowsModal);
  if (!process.stdin.isTTY) throw new Error("Interactive terminal input is required for github:now.");
  const readline = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await callback((query, defaultValue = "") => new Promise((resolveAnswer) => readline.question(query, (answer) => resolveAnswer(answer || defaultValue))));
  } finally {
    readline.close();
  }
}

function askWindowsModal(query, defaultValue = "") {
  const isConfirmation = /\[y\/N\]:\s*$/i.test(query);
  const script = isConfirmation
    ? [
        "Add-Type -AssemblyName System.Windows.Forms",
        `$result = [System.Windows.Forms.MessageBox]::Show(${quotePowerShellString(query.replace(/\s*\[y\/N\]:\s*$/i, ""))}, 'GitHub Commit Review', 'YesNo', 'Question')`,
        "if ($result -eq 'Yes') { 'yes' } else { 'no' }",
      ].join("; ")
    : [
        "Add-Type -AssemblyName Microsoft.VisualBasic",
        `[Microsoft.VisualBasic.Interaction]::InputBox(${quotePowerShellString(query)}, 'GitHub Commit Review', ${quotePowerShellString(defaultValue)})`,
      ].join("; ");
  return execFileSync("powershell.exe", ["-NoProfile", "-STA", "-Command", script], { encoding: "utf8", windowsHide: false }).trim();
}

function quotePowerShellString(value) { return `'${value.replaceAll("'", "''")}'`; }
function isYes(value) { return ["y", "yes"].includes(value.trim().toLowerCase()); }
function isGithubRemote(value) { return /^(?:https?:\/\/github\.com\/|git@github\.com:)[^/]+\/[^/]+(?:\.git)?$/i.test(value); }

function checkAndPull() {
  const upstream = runGitQuiet(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
  if (!upstream) {
    console.log("\n  No upstream branch found. Skipping pull.\n");
    return;
  }
  console.log("\n  > git fetch");
  runGit(["-c", "maintenance.auto=false", "-c", "gc.auto=0", "fetch", "--quiet"]);
  const behind = Number(runGitQuiet(["rev-list", "--count", `HEAD..${upstream}`]) || 0);
  if (!behind) {
    console.log("  Already up to date.\n");
    return;
  }
  console.log(`  Branch is behind ${upstream} by ${behind} commit(s).`);
  console.log("  > git pull --rebase --autostash");
  runGit(["-c", "maintenance.auto=false", "-c", "gc.auto=0", "pull", "--rebase", "--autostash"]);
  console.log("");
}

function runGitQuiet(args) {
  try { return runGit(args, { silent: true }); } catch { return ""; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`\n  Error: ${error.message}\n`);
    process.exit(1);
  });
}
