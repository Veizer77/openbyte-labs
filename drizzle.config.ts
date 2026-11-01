import { defineConfig } from "drizzle-kit";

// Schema generation is offline. Running migrations requires a separately verified direct connection.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*.ts",
  out: "./src/db/migrations",
  strict: true,
  verbose: true,
});
