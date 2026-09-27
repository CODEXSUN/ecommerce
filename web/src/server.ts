import { createServer } from "node:http";
import { landingStyles } from "./landing-styles.js";

const port = Number(process.env.ECOMMERCE_WEB_PORT ?? 6231);
const apiUrl = process.env.ECOMMERCE_API_URL ?? "http://127.0.0.1:6230";
const server = createServer(async (_request, response) => {
  const products = await readFeaturedProducts();
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(documentMarkup(products));
});

server.listen(port, "127.0.0.1", () => console.log(`Ecommerce web listening on http://127.0.0.1:${port}`));
const shutdown = () => server.close(() => process.exit(0));
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

async function readFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${apiUrl}/api/v1/catalog/products?featured=true`);
    if (!response.ok) return [];
    const payload = await response.json() as { products?: Product[] };
    return payload.products ?? [];
  } catch { return []; }
}

function documentMarkup(products: readonly Product[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Aurelia Market — considered goods for everyday rituals."><title>Aurelia Market — considered goods</title><style>${landingStyles}</style></head><body>${landingMarkup(products)}</body></html>`;
}

function landingMarkup(products: readonly Product[]): string {
  const categories = [...new Set(products.map((product) => product.category))];
  const productMarkup = products.map((product) => `<article class="landing-product-card"><a href="#collection"><div class="landing-product-image"><img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.title)}" loading="lazy"></div><div class="landing-product-meta"><div><strong>${escapeHtml(product.title)}</strong><span>${escapeHtml(product.category)} · ${product.featured ? "Featured" : "Small batch"}</span></div><b>$${(product.priceCents / 100).toFixed(2)}</b></div></a></article>`).join("");
  return `<div class="storefront-page"><header class="landing-header"><div class="landing-announcement">Complimentary delivery on orders over $150 <span>•</span> Season 04 is here</div><div class="landing-header-row"><a class="landing-brand" href="/">AURELIA<small>MARKET</small></a><nav aria-label="Primary navigation"><a href="#collection">Shop</a><a href="#standard">Our standard</a><a href="#collection">New arrivals</a></nav><div class="landing-actions"><a href="#collection">Search</a><a href="#collection">Bag <span>0</span></a></div></div><div class="landing-category-row">${categories.map((category) => `<a href="#collection">${escapeHtml(category)}</a>`).join("")}</div></header><main><section class="landing-hero" aria-labelledby="landing-title"><div class="landing-copy"><p class="eyebrow">THE EVERYDAY EDIT / 04</p><h1 id="landing-title">Objects with a little more <em>meaning.</em></h1><p class="landing-lede">A considered collection of clothing, objects, and quiet luxuries for the rhythm of modern life.</p><a class="landing-button" href="#collection">Explore the edit <span aria-hidden="true">↗</span></a></div><div class="landing-art" aria-label="Aurelia Market seasonal collection artwork"><div class="landing-sun"></div><div class="landing-card"><span>04</span><strong>NEW<br>RITUALS</strong><small>CURATED IN<br>THE PACIFIC NW</small></div></div></section><section class="landing-ribbon" aria-label="Aurelia Market values"><span>LOW IMPACT MATERIALS</span><span>•</span><span>DESIGNED TO LAST</span><span>•</span><span>SMALL BATCHED</span></section><section class="landing-collection" id="collection" aria-labelledby="collection-title"><div class="section-intro"><div><p class="eyebrow">THE COLLECTION</p><h2 id="collection-title">Find your new <em>favourite.</em></h2></div><a class="text-link" href="#collection">View all pieces ↗</a></div><div class="landing-products">${productMarkup || `<p class="landing-empty">Start the API to load the collection.</p>`}</div></section><section class="landing-standard" id="standard" aria-labelledby="standard-title"><p class="eyebrow">OUR STANDARD / 01</p><div><h2 id="standard-title">Less, but <em>better.</em></h2><p>We partner with makers who care about the details — natural materials, honest processes, and objects that get better with time.</p><a class="text-link" href="#collection">Shop considered goods ↗</a></div></section></main></div>`;
}

function escapeHtml(value: string): string { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }

interface Product { readonly id: string; readonly title: string; readonly description: string; readonly category: string; readonly priceCents: number; readonly currency: "USD"; readonly inventory: number; readonly featured: boolean; readonly imageUrl: string; }
