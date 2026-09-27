import assert from "node:assert/strict";
import test from "node:test";
import { cartItemInputSchema } from "../src/index.js";

test("cart input rejects unsafe quantities", () => {
  assert.equal(cartItemInputSchema.safeParse({ productId: "bad", quantity: 0 }).success, false);
});
