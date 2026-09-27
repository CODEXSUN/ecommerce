import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const services = {
  "ecommerce-api": { displayName: "Ecommerce API", envFile: "api/.app.env", envKey: "ECOMMERCE_API_PORT", defaultPort: 6230 },
  "ecommerce-web": { displayName: "Ecommerce web", envFile: "web/.app.env", envKey: "ECOMMERCE_WEB_PORT", defaultPort: 6231 },
};
const [serviceName, ...flags] = process.argv.slice(2);
if (!services[serviceName]) throw new Error(`Use one of: ${Object.keys(services).join(", ")}.`);
const service = services[serviceName];
const envText = existsSync(resolve(process.cwd(), service.envFile)) ? readFileSync(resolve(process.cwd(), service.envFile), "utf8") : "";
const match = envText.match(new RegExp(`^${service.envKey}=(\\d+)`, "m"));
const port = Number(match?.[1] ?? service.defaultPort);
if (flags.includes("--check")) {
  try { execFileSync("powershell.exe", ["-NoProfile", "-Command", `Test-NetConnection -ComputerName 127.0.0.1 -Port ${port} -InformationLevel Quiet`], { stdio: "inherit" }); }
  catch { throw new Error(`${service.displayName} is not listening on ${port}.`); }
  console.log(`${service.displayName} is listening on ${port}.`);
} else if (flags.includes("--stop")) {
  console.log(`No managed ${service.displayName} process is registered yet.`);
} else {
  console.log(`Preflight prepared for ${service.displayName} on ${port}. Add the service start command when its runtime is implemented.`);
}
