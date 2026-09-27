import { ensureLocalIdentityEnvironment, LocalIdentityStore } from "@codexsun/platform-core";
import { resolve } from "node:path";
import { applicationDatabasePath } from "./storage.js";
export const databasePath = applicationDatabasePath("ecommerce");
export const identityBootstrap = ensureLocalIdentityEnvironment({ applicationId: "ecommerce", databasePath, envPath: resolve(import.meta.dirname, "../..", ".env") });
export const identity = new LocalIdentityStore(identityBootstrap.configuration);
export const identityReady = identity.initialize();
