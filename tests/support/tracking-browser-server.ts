import { createServer } from "node:http";
import next from "next";
import config from "../../next.config";

if (process.env.TRACKING_ISOLATED_BROWSER_TEST !== "confirmed")
  throw new Error("Jalankan melalui tracking-browser-smoke.ts.");
const port = 3102;
const app = next({
  dev: true,
  hostname: "127.0.0.1",
  port,
  dir: process.cwd(),
  conf: { ...config, distDir: ".next/tracking-browser" },
});
const handler = app.getRequestHandler();
void app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      void handler(req, res);
    });
    server.listen(port, "127.0.0.1", () => process.send?.({ ready: true }));
    process.on("message", (message) => {
      if (message === "stop")
        server.close(() => {
          void app.close().then(() => process.exit(0));
        });
    });
  })
  .catch((error: unknown) => {
    console.error(
      error instanceof Error
        ? error.message
        : "Isolated browser server failed to start.",
    );
    process.exit(1);
  });
