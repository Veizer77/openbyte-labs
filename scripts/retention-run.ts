import postgres from "postgres";
import { loadLocalEnv } from "./lib/load-local-env";
import { directDatabaseUri } from "@/db/target-selection";

loadLocalEnv();

async function main() {
  const apply = process.argv.includes("--apply");
  const uri = directDatabaseUri(process.env);
  if (!uri) {
    console.log("retention:run (dry-run): DATABASE_URL_UNPOOLED / DATABASE_URL belum dikonfigurasi.");
    return;
  }

  const client = postgres(uri, { max: 1, prepare: false, connect_timeout: 10 });
  try {
    const [counts] = await client<{
      expired_rate_limits: string;
      old_bookings: string;
      old_inquiries: string;
      old_quotes: string;
    }[]>`
      SELECT
        (SELECT count(*)::text FROM rate_limit_windows WHERE reset_at < now() - interval '7 days') AS expired_rate_limits,
        (SELECT count(*)::text FROM consultation_bookings WHERE created_at < now() - interval '24 months' AND status IN ('completed', 'cancelled', 'no_show')) AS old_bookings,
        (SELECT count(*)::text FROM inquiries WHERE created_at < now() - interval '24 months' AND status IN ('closed', 'spam')) AS old_inquiries,
        (SELECT count(*)::text FROM calculator_quotes WHERE created_at < now() - interval '24 months') AS old_quotes
    `;

    console.log(
      `Retensi data (${apply ? "APPLY" : "DRY-RUN"}): rate_limit_windows=${counts?.expired_rate_limits ?? 0}, consultation_bookings=${counts?.old_bookings ?? 0}, inquiries=${counts?.old_inquiries ?? 0}, calculator_quotes=${counts?.old_quotes ?? 0}`,
    );

    if (apply) {
      await client`DELETE FROM rate_limit_windows WHERE reset_at < now() - interval '7 days'`;
      console.log("Window rate-limit kedaluwarsa (>7 hari) telah dibersihkan.");
    }
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch(() => {
  console.error("Retention check gagal dijalankan.");
  process.exitCode = 1;
});
