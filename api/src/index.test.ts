import assert from "node:assert/strict";
import test from "node:test";
import { platformAuth } from "./index.js";

test("initializes Platform JWT credentials for development", () => {
  assert.equal(platformAuth.secret.length, 64);
  assert.equal(platformAuth.operatorToken.split(".").length, 3);
});
