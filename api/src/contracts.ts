export interface Product { readonly id: string; readonly slug: string; readonly title: string; readonly description: string; readonly category: string; readonly priceCents: number; readonly currency: "USD"; readonly inventory: number; readonly featured: boolean; readonly imageUrl: string; }
export interface CartItemInput { readonly productId: string; readonly quantity: number; }
export interface Cart { readonly id: string; readonly actorId: string; readonly items: readonly { readonly product: Product; readonly quantity: number; readonly lineTotalCents: number }[]; readonly totalCents: number; readonly currency: "USD"; }
export interface Order { readonly id: string; readonly actorId: string; readonly status: "placed" | "fulfilling" | "shipped" | "cancelled"; readonly totalCents: number; readonly currency: "USD"; readonly createdAt: string; readonly items: readonly { readonly productId: string; readonly quantity: number; readonly unitPriceCents: number }[]; }

export const cartItemInputSchema = {
  safeParse(value: unknown): { success: true; data: CartItemInput } | { success: false; error: Error } {
    const input = value as Partial<CartItemInput> | null;
    const quantity = input?.quantity;
    return input && typeof input.productId === "string" && /^[0-9a-f-]{36}$/iu.test(input.productId) && typeof quantity === "number" && Number.isInteger(quantity) && quantity >= 1 && quantity <= 20
      ? { success: true, data: { productId: input.productId, quantity: quantity as number } }
      : { success: false, error: new Error("Invalid cart item.") };
  },
};
export const productSchema = { parse(value: Product): Product { return value; } };
export const cartSchema = { parse(value: Cart): Cart { return value; } };
export const orderSchema = { parse(value: Order): Order { return value; } };
