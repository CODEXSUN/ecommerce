import { ensurePlatformJwtEnvironment } from "@codexsun/platform-core";
import { resolve } from "node:path";
import { applicationDatabasePath } from "./storage.js";

export const platformAuth = ensurePlatformJwtEnvironment({ applicationId: "ecommerce", envPath: resolve(import.meta.dirname, "../..", ".env") });

export const ecommerceApplication = {
  id: "ecommerce",
  label: "Ecommerce",
  version: "0.1.0",
  databasePath: applicationDatabasePath("ecommerce"),
  operatorToken: platformAuth.operatorToken,
} as const;
