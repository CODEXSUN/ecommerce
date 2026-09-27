import { applicationDatabasePath, ecommerceApplication, platformAuth } from "./index.js";
import { EcommerceDatabase } from "./database.js";
import { createEcommerceHttpServer } from "./http.js";

const port = Number(process.env.ECOMMERCE_API_PORT ?? 6230);
const database = new EcommerceDatabase(applicationDatabasePath("ecommerce"));
const frontendUrl = process.env.ECOMMERCE_WEB_URL ?? "http://127.0.0.1:6231/";
const server = createEcommerceHttpServer({ database, jwt: { secret: platformAuth.secret }, operatorToken: platformAuth.operatorToken, version: ecommerceApplication.version, frontendUrl });
server.listen(port, "127.0.0.1", () => console.log(`Ecommerce API listening on http://127.0.0.1:${port}`));
const shutdown = () => { server.close(() => { database.close(); process.exit(0); }); };
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
