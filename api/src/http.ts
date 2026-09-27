import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readPlatformJwtClaims, type PlatformJwtConfiguration } from "@codexsun/platform-core";
import { apiError, platformHealthSchema } from "@codexsun/contracts";
import { cartItemInputSchema, productSchema, cartSchema, orderSchema } from "./contracts.js";
import { EcommerceDatabase, type ProductRow } from "./database.js";

export interface EcommerceHttpOptions { readonly database: EcommerceDatabase; readonly jwt: PlatformJwtConfiguration; readonly operatorToken: string; readonly version: string; readonly frontendUrl: string; }

export function createEcommerceHttpServer(options: EcommerceHttpOptions) {
  return createServer(async (request, response) => {
    try { await dispatch(request, response, options); } catch (error) { sendJson(response, 500, apiError(error instanceof Error ? error.message : "Internal server error.", "server.internal")); }
  });
}

async function dispatch(request: IncomingMessage, response: ServerResponse, options: EcommerceHttpOptions): Promise<void> {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "authorization, content-type");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  if (request.method === "OPTIONS") return sendJson(response, 204, null);
  if (request.method === "GET" && url.pathname === "/") return sendWelcomeRedirect(response, options.frontendUrl);
  if (request.method === "GET" && url.pathname === "/healthz") return sendJson(response, 200, { status: "ok", service: "ecommerce-api", version: options.version });
  if (request.method === "GET" && url.pathname === "/api/v1/platform/health") return sendJson(response, 200, platformHealthSchema.parse({ status: "ok", providers: ["platform.core", "ecommerce"], readiness: [{ id: "ecommerce", state: "started" }] }));
  if (request.method === "GET" && url.pathname === "/api/v1/catalog/categories") return sendJson(response, 200, { categories: options.database.categories() });
  if (request.method === "GET" && url.pathname === "/api/v1/catalog/products") return sendJson(response, 200, { products: options.database.listProducts({ query: url.searchParams.get("q") ?? undefined, category: url.searchParams.get("category") ?? undefined, featured: url.searchParams.get("featured") === "true" }).map(toProduct) });
  if (request.method === "GET" && url.pathname.startsWith("/api/v1/catalog/products/")) {
    const product = options.database.findProduct(url.pathname.split("/").pop() ?? "");
    return product ? sendJson(response, 200, toProduct(product)) : sendJson(response, 404, apiError("Product not found.", "catalog.product-not-found"));
  }
  if (request.method === "POST" && url.pathname === "/api/v1/auth/operator-token") {
    if (process.env.APP_MODE === "production") return sendJson(response, 403, apiError("Development token route is disabled.", "auth.development-disabled"));
    return sendJson(response, 200, { token: options.operatorToken, actorId: "platform.operator" });
  }
  if (url.pathname.startsWith("/api/v1/cart") || url.pathname.startsWith("/api/v1/orders") || url.pathname === "/api/v1/me") {
    const actor = authenticate(request, options.jwt);
    if (!actor) return sendJson(response, 401, apiError("A valid bearer token is required.", "auth.required"));
    if (request.method === "GET" && url.pathname === "/api/v1/me") return sendJson(response, 200, { actorId: actor, permissions: ["ecommerce.read", "ecommerce.write"] });
    if (request.method === "GET" && url.pathname === "/api/v1/cart") return sendJson(response, 200, cartSchema.parse(toCart(options.database.cart(actor))));
    if (request.method === "POST" && url.pathname === "/api/v1/cart/items") {
      const input = cartItemInputSchema.safeParse(await readJson(request));
      if (!input.success) return sendJson(response, 400, apiError("Product and quantity are required.", "cart.invalid-input"));
      try { return sendJson(response, 200, cartSchema.parse(toCart(options.database.addToCart(actor, input.data.productId, input.data.quantity)))); } catch (error) { return sendJson(response, 409, apiError(error instanceof Error ? error.message : "Cart update failed.", "cart.unavailable")); }
    }
    if (request.method === "DELETE" && url.pathname.startsWith("/api/v1/cart/items/")) return sendJson(response, 200, cartSchema.parse(toCart(options.database.removeFromCart(actor, url.pathname.split("/").pop() ?? ""))));
    if (request.method === "POST" && url.pathname === "/api/v1/orders") {
      try { return sendJson(response, 201, orderSchema.parse(options.database.placeOrder(actor))); } catch (error) { return sendJson(response, 409, apiError(error instanceof Error ? error.message : "Order could not be placed.", "order.invalid")); }
    }
    if (request.method === "GET" && url.pathname === "/api/v1/orders") return sendJson(response, 200, { orders: options.database.orders(actor).map((order) => orderSchema.parse(order)) });
  }
  sendJson(response, 404, apiError("Route not found.", "route.not-found"));
}

function authenticate(request: IncomingMessage, jwt: PlatformJwtConfiguration): string | undefined {
  const header = request.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  return token ? readPlatformJwtClaims(jwt, token)?.subject : undefined;
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) { chunks.push(Buffer.from(chunk)); if (Buffer.concat(chunks).length > 1_000_000) throw new Error("Request body is too large."); }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function toProduct(product: ProductRow) { return productSchema.parse(product); }
function toCart(cart: ReturnType<EcommerceDatabase["cart"]>) { return { ...cart, currency: "USD" as const, items: cart.items.map((item) => ({ ...item, product: toProduct(item.product) })) }; }
function sendJson(response: ServerResponse, status: number, body: unknown): void { response.statusCode = status; response.setHeader("Content-Type", "application/json; charset=utf-8"); response.end(body === null ? "" : JSON.stringify(body)); }
function sendWelcomeRedirect(response: ServerResponse, frontendUrl: string): void {
  const destination = new URL("/", frontendUrl).toString();
  response.statusCode = 302;
  response.setHeader("Location", destination);
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(`<!doctype html><title>Welcome to Ecommerce</title><p>Welcome to Ecommerce. Redirecting to <a href="${destination}">${destination}</a>…</p>`);
}
