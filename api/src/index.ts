import { applicationDatabasePath } from "./storage.js";

export const ecommerceApplication = {
  id: "ecommerce",
  label: "Ecommerce",
  version: "0.1.0",
  databasePath: applicationDatabasePath("ecommerce"),
} as const;
