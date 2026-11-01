import { sql } from "drizzle-orm";
import { getDb } from "@/db";

export async function GET() {
  try {
    await getDb().execute(sql`select 1`);
    return Response.json(
      { status: "ok", database: "connected" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "not_ready", database: "not_connected" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
