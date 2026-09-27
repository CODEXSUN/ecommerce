import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createPlatformJwtToken } from "@codexsun/platform-core";
import { EcommerceDatabase } from "./database.js";
import { createEcommerceHttpServer } from "./http.js";

test("catalog, authenticated cart, and order flow work end to end", async () => {
  const database = new EcommerceDatabase(join(mkdtempSync(join(tmpdir(), "ecommerce-test-")), "test.sqlite"));
  const server = createEcommerceHttpServer({ database, jwt: { secret: "test-secret" }, operatorToken: "unused", version: "0.1.0", frontendUrl: "http://127.0.0.1:6231" });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const base = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;
  const welcome = await fetch(base, { redirect: "manual" });
  assert.equal(welcome.status, 302);
  assert.equal(welcome.headers.get("location"), "http://127.0.0.1:6231/");
  const products = await fetch(`${base}/api/v1/catalog/products?featured=true`).then((response) => response.json()) as { products: Array<{ id: string }> };
  const token = createPlatformJwtToken({ secret: "test-secret" }, { subject: "customer.demo" });
  const cart = await fetch(`${base}/api/v1/cart/items`, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ productId: products.products[0]!.id, quantity: 1 }) }).then((response) => response.json()) as { totalCents: number };
  assert.ok(cart.totalCents > 0);
  const order = await fetch(`${base}/api/v1/orders`, { method: "POST", headers: { authorization: `Bearer ${token}` } }).then((response) => response.json()) as { status: string };
  assert.equal(order.status, "placed");
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  database.close();
});
