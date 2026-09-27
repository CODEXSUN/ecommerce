import { createConnection } from "node:net";
import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const services = [
  { name: "API", port: Number(process.env.ECOMMERCE_API_PORT ?? 6230), script: "dev:api" },
  { name: "web", port: Number(process.env.ECOMMERCE_WEB_PORT ?? 6231), script: "dev:web" },
];
let children = [];
let stopping = false;

await main();

async function main() {
  const occupied = (await Promise.all(services.map(async (service) => ({ service, occupied: await isPortOccupied(service.port) })))).filter((entry) => entry.occupied);
  if (occupied.length > 0) {
    console.error("Ecommerce dev server was not started because these ports are already in use:");
    for (const { service } of occupied) console.error(`- ${service.name}: ${service.port}`);
    console.error("Stop the existing Ecommerce dev process before running dev:ecommerce again.");
    process.exitCode = 1;
    return;
  }

  children = services.map(({ script }) => startWorkspace(script));
  for (const child of children) {
    child.once("error", () => shutdown(1));
    child.once("exit", (code) => { if (!stopping) shutdown(code ?? 1); });
  }
  process.once("SIGINT", () => shutdown(0));
  process.once("SIGTERM", () => shutdown(0));
}

function startWorkspace(script) {
  const command = process.platform === "win32" ? "cmd.exe" : npmCommand;
  const args = process.platform === "win32" ? ["/d", "/s", "/c", `${npmCommand} run ${script}`] : ["run", script];
  return spawn(command, args, { cwd: process.cwd(), env: process.env, stdio: "inherit" });
}

function shutdown(code) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (!child.killed) child.kill("SIGINT");
  setTimeout(() => { process.exitCode = code; }, 250);
}

function isPortOccupied(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ host: "127.0.0.1", port });
    const finish = (occupied) => { socket.destroy(); resolve(occupied); };
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
    socket.setTimeout(500, () => finish(false));
  });
}
