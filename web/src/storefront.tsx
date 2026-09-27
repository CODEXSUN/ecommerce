import { EcommerceHeader } from "@codexsun/ui/layouts/ecommerce-header";
import { ProductCard, type ProductItem } from "@codexsun/ui/blocks/product-card";
interface Product { readonly id: string; readonly title: string; readonly description: string; readonly category: string; readonly priceCents: number; readonly currency: "USD"; readonly inventory: number; readonly featured: boolean; readonly imageUrl: string; }

export function StorefrontApp({ products }: { readonly products: readonly Product[] }) {
  const cards: ProductItem[] = products.map((product) => ({ id: product.id, title: product.title, description: product.description, category: product.category, imageUrl: product.imageUrl, price: product.priceCents / 100, currency: product.currency, inStock: product.inventory > 0, isNew: product.featured }));
  const categories = [...new Set(products.map((product) => product.category))].map((category) => ({ id: category.toLowerCase(), label: category, href: `#${category.toLowerCase()}` }));
  return <div className="storefront-page">
    <EcommerceHeader brand={{ title: "Aurelia Market", href: "/" }} announcement={{ message: "Complimentary delivery on orders over $150", showFreeShippingMeter: true, freeShippingProgress: 68 }} categories={categories} quickLinks={[{ href: "#collection", label: "Shop the edit" }, { href: "#standard", label: "Our standard" }]} actions={{ cartCount: 0, currency: "USD" }} />
    <main>
      <section className="landing-hero" aria-labelledby="landing-title"><div className="landing-copy"><p className="eyebrow">THE EVERYDAY EDIT / 04</p><h1 id="landing-title">Objects with a little more <em>meaning.</em></h1><p className="landing-lede">A considered collection of clothing, objects, and quiet luxuries for the rhythm of modern life.</p><a className="landing-button" href="#collection">Explore the edit <span aria-hidden="true">↗</span></a></div><div className="landing-art" aria-label="Aurelia Market seasonal collection artwork"><div className="landing-sun" /><div className="landing-card"><span>04</span><strong>NEW<br />RITUALS</strong><small>CURATED IN<br />THE PACIFIC NW</small></div></div></section>
      <section className="landing-ribbon" aria-label="Aurelia Market values"><span>LOW IMPACT MATERIALS</span><span>•</span><span>DESIGNED TO LAST</span><span>•</span><span>SMALL BATCHED</span></section>
      <section className="landing-collection" id="collection" aria-labelledby="collection-title"><div className="section-intro"><div><p className="eyebrow">THE COLLECTION</p><h2 id="collection-title">Find your new <em>favourite.</em></h2></div><a className="text-link" href="#collection">View all pieces ↗</a></div><div className="landing-products">{cards.map((product) => <ProductCard product={product} showWishlist />)}</div></section>
      <section className="landing-standard" id="standard" aria-labelledby="standard-title"><p className="eyebrow">OUR STANDARD / 01</p><div><h2 id="standard-title">Less, but <em>better.</em></h2><p>We partner with makers who care about the details — natural materials, honest processes, and objects that get better with time.</p><a className="text-link" href="#collection">Shop considered goods ↗</a></div></section>
    </main>
  </div>;
}
