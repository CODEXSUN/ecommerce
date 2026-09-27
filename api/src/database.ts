import { DatabaseSync } from "node:sqlite";
import { dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import type { Product } from "./contracts.js";

export type ProductRow = Product & { createdAt: string };

export class EcommerceDatabase {
  readonly connection: DatabaseSync;

  constructor(readonly filename: string) {
    mkdirSync(dirname(filename), { recursive: true });
    this.connection = new DatabaseSync(filename);
    this.connection.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
    this.migrate();
    this.seed();
  }

  close(): void { this.connection.close(); }

  listProducts(filters: { query?: string; category?: string; featured?: boolean } = {}): ProductRow[] {
    const clauses: string[] = [];
    const values: string[] = [];
    if (filters.query) { clauses.push("(title LIKE ? OR description LIKE ?)"); values.push(`%${filters.query}%`, `%${filters.query}%`); }
    if (filters.category) { clauses.push("category = ?"); values.push(filters.category); }
    if (filters.featured) clauses.push("featured = 1");
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    return (this.connection.prepare(`SELECT * FROM products ${where} ORDER BY featured DESC, created_at DESC`).all(...values) as unknown as Record<string, unknown>[]).map(toProductRow);
  }

  findProduct(idOrSlug: string): ProductRow | undefined {
    const row = this.connection.prepare("SELECT * FROM products WHERE id = ? OR slug = ? LIMIT 1").get(idOrSlug, idOrSlug) as unknown as Record<string, unknown> | undefined;
    return row ? toProductRow(row) : undefined;
  }

  categories(): string[] {
    return (this.connection.prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as Array<{ category: string }>).map((row) => row.category);
  }

  cart(actorId: string): { id: string; actorId: string; items: Array<{ product: ProductRow; quantity: number; lineTotalCents: number }>; totalCents: number } {
    const existing = this.connection.prepare("SELECT id FROM carts WHERE actor_id = ? AND status = 'open'").get(actorId) as { id: string } | undefined;
    const id = existing?.id ?? randomUUID();
    if (!existing) this.connection.prepare("INSERT INTO carts (id, actor_id, status, created_at, updated_at) VALUES (?, ?, 'open', ?, ?)").run(id, actorId, new Date().toISOString(), new Date().toISOString());
    const rows = this.connection.prepare("SELECT p.*, ci.quantity FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.cart_id = ? ORDER BY ci.created_at").all(id) as Array<Record<string, unknown> & { quantity: number }>;
    const items = rows.map(({ quantity, ...row }) => { const product = toProductRow(row); return { product, quantity, lineTotalCents: product.priceCents * quantity }; });
    return { id, actorId, items, totalCents: items.reduce((sum, item) => sum + item.lineTotalCents, 0) };
  }

  addToCart(actorId: string, productId: string, quantity: number): ReturnType<EcommerceDatabase["cart"]> {
    const product = this.findProduct(productId);
    if (!product || product.inventory < quantity) throw new Error("Product is unavailable or quantity exceeds inventory.");
    const cart = this.cart(actorId);
    const current = this.connection.prepare("SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?").get(cart.id, product.id) as { quantity: number } | undefined;
    const next = (current?.quantity ?? 0) + quantity;
    if (next > product.inventory) throw new Error("Quantity exceeds inventory.");
    if (current) this.connection.prepare("UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?").run(next, cart.id, product.id);
    else this.connection.prepare("INSERT INTO cart_items (cart_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?)").run(cart.id, product.id, quantity, new Date().toISOString());
    return this.cart(actorId);
  }

  removeFromCart(actorId: string, productId: string): ReturnType<EcommerceDatabase["cart"]> {
    const cart = this.cart(actorId);
    this.connection.prepare("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?").run(cart.id, productId);
    return this.cart(actorId);
  }

  placeOrder(actorId: string): { id: string; actorId: string; status: "placed"; totalCents: number; currency: "USD"; createdAt: string; items: Array<{ productId: string; quantity: number; unitPriceCents: number }> } {
    const cart = this.cart(actorId);
    if (!cart.items.length) throw new Error("Cart is empty.");
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    this.connection.exec("BEGIN IMMEDIATE");
    try {
      for (const item of cart.items) {
        const current = this.connection.prepare("SELECT inventory FROM products WHERE id = ?").get(item.product.id) as { inventory: number };
        if (current.inventory < item.quantity) throw new Error("Inventory changed. Review your cart.");
        this.connection.prepare("UPDATE products SET inventory = inventory - ? WHERE id = ?").run(item.quantity, item.product.id);
      }
      this.connection.prepare("INSERT INTO orders (id, actor_id, status, total_cents, currency, created_at) VALUES (?, ?, 'placed', ?, 'USD', ?)").run(id, actorId, cart.totalCents, createdAt);
      for (const item of cart.items) this.connection.prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES (?, ?, ?, ?)").run(id, item.product.id, item.quantity, item.product.priceCents);
      this.connection.prepare("UPDATE carts SET status = 'ordered', updated_at = ? WHERE id = ?").run(createdAt, cart.id);
      this.connection.exec("COMMIT");
    } catch (error) { this.connection.exec("ROLLBACK"); throw error; }
    return { id, actorId, status: "placed", totalCents: cart.totalCents, currency: "USD", createdAt, items: cart.items.map((item) => ({ productId: item.product.id, quantity: item.quantity, unitPriceCents: item.product.priceCents })) };
  }

  orders(actorId: string): Array<{ id: string; actorId: string; status: "placed" | "fulfilling" | "shipped" | "cancelled"; totalCents: number; currency: "USD"; createdAt: string; items: Array<{ productId: string; quantity: number; unitPriceCents: number }> }> {
    const orders = this.connection.prepare("SELECT * FROM orders WHERE actor_id = ? ORDER BY created_at DESC").all(actorId) as Array<{ id: string; actor_id: string; status: "placed" | "fulfilling" | "shipped" | "cancelled"; total_cents: number; currency: "USD"; created_at: string }>;
    return orders.map((order) => ({ id: order.id, actorId: order.actor_id, status: order.status, totalCents: order.total_cents, currency: "USD", createdAt: order.created_at, items: this.connection.prepare("SELECT product_id as productId, quantity, unit_price_cents as unitPriceCents FROM order_items WHERE order_id = ?").all(order.id) as Array<{ productId: string; quantity: number; unitPriceCents: number }> }));
  }

  private migrate(): void {
    this.connection.exec("CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, price_cents INTEGER NOT NULL, currency TEXT NOT NULL, inventory INTEGER NOT NULL, featured INTEGER NOT NULL, image_url TEXT NOT NULL, created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS carts (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL); CREATE UNIQUE INDEX IF NOT EXISTS carts_open_actor ON carts(actor_id) WHERE status = 'open'; CREATE TABLE IF NOT EXISTS cart_items (cart_id TEXT NOT NULL REFERENCES carts(id), product_id TEXT NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(cart_id, product_id)); CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, status TEXT NOT NULL, total_cents INTEGER NOT NULL, currency TEXT NOT NULL, created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS order_items (order_id TEXT NOT NULL REFERENCES orders(id), product_id TEXT NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL, unit_price_cents INTEGER NOT NULL, PRIMARY KEY(order_id, product_id));");
    this.connection.prepare("INSERT OR IGNORE INTO schema_migrations (version, applied_at) VALUES ('0001-commerce-foundation', ?)").run(new Date().toISOString());
  }

  private seed(): void {
    const count = (this.connection.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number }).count;
    if (count > 0) return;
    const products = [
      ["Aster Carryall", "aster-carryall", "Structured recycled nylon with room for the day ahead.", "Bags", 14800, 24, 1, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85"],
      ["Solis Knit Set", "solis-knit-set", "A softly tailored two-piece in breathable cotton knit.", "Apparel", 18600, 18, 1, "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85"],
      ["Arc Desk Light", "arc-desk-light", "Warm, sculptural light for focused evenings.", "Home", 9200, 31, 0, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85"],
      ["Morrow Field Watch", "morrow-field-watch", "A quiet everyday watch with a brushed steel case.", "Accessories", 23400, 12, 1, "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85"],
      ["Lumen Stoneware", "lumen-stoneware", "Hand-finished tableware for slow, generous gatherings.", "Home", 6400, 44, 0, "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=85"],
      ["Vale Runner", "vale-runner", "A light, grounded runner made for city miles.", "Footwear", 11200, 27, 0, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"],
    ] as const;
    const insert = this.connection.prepare("INSERT INTO products (id, slug, title, description, category, price_cents, currency, inventory, featured, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?, ?)");
    const now = new Date().toISOString();
    for (const [title, slug, description, category, priceCents, inventory, featured, imageUrl] of products) insert.run(randomUUID(), slug, title, description, category, priceCents, inventory, featured, imageUrl, now);
  }
}

function toProductRow(row: Record<string, unknown>): ProductRow {
  return {
    id: String(row.id), slug: String(row.slug), title: String(row.title), description: String(row.description), category: String(row.category),
    priceCents: Number(row.price_cents ?? row.priceCents), currency: "USD", inventory: Number(row.inventory), featured: Boolean(row.featured),
    imageUrl: String(row.image_url ?? row.imageUrl), createdAt: String(row.created_at ?? row.createdAt),
  };
}
