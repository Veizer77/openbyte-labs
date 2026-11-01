import { defineConfig } from "drizzle-kit";

// PRD G.2/G.3 names the direct connection DATABASE_URI_DIRECT; the older
// DATABASE_DIRECT_URL is accepted so existing local files keep working.
const url = process.env.DATABASE_URI_DIRECT ?? process.env.DATABASE_DIRECT_URL;
if (!url) throw new Error("DATABASE_URI_DIRECT belum diatur.");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*.ts",
  out: "./src/db/migrations",
  dbCredentials: { url },
  strict: true,
});
