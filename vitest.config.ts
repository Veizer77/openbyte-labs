import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(
        new URL("./tests/support/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    // 85 worker paralel membuat tes yang mem-spawn proses Node (load-local-env)
    // dan tes hashing Better Auth kehabisan timeout 5 detik pada mesin Windows.
    // Batasi worker agar hasil suite deterministis tanpa menaikkan timeout global.
    maxWorkers: 4,
  },
});
