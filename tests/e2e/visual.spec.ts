import { test, expect } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

let referenceCss: string;
test.beforeAll(async () => {
  // The bundled CSS predates the fixed-pixel Pencil export. Compile the reference's
  // own class names separately, just as its Tailwind CDN script does in the browser.
  referenceCss = (
    await postcss([
      tailwindcss({
        content: ["./prototype/stitch/**/*.html"],
        corePlugins: { preflight: false },
      }),
    ]).process("@tailwind base; @tailwind utilities;", { from: undefined })
  ).css;
});

for (const [key, route] of [
  ["cms/login-admin", "/admin/login"],
]) {
  test(`visual reference ${key}`, async ({ browser, page }) => {
    const reference = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const fonts =
      (await readFile("prototype/stitch/assets/font-0.css", "utf8")) +
      (await readFile("prototype/stitch/assets/font-1.css", "utf8"));
    await reference.route("https://cdn.tailwindcss.com/**", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );
    await reference.route("https://fonts.googleapis.com/**", (route) =>
      route.fulfill({
        contentType: "text/css",
        body: fonts.replaceAll(
          "url(fonts/",
          "url(http://reference.test/assets/fonts/",
        ),
      }),
    );
    await reference.route("http://reference.test/**", async (route) => {
      const pathname = decodeURIComponent(
        new URL(route.request().url()).pathname,
      );
      const extension = path.extname(pathname);
      const contentType =
        {
          ".html": "text/html",
          ".css": "text/css",
          ".woff2": "font/woff2",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".svg": "image/svg+xml",
        }[extension] ?? "application/octet-stream";
      await route.fulfill({
        contentType,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: await readFile(path.join("prototype/stitch", pathname)),
      });
    });
    await reference.goto(`http://reference.test/${key}.html`);
    await reference.addStyleTag({ content: referenceCss });
    await reference.evaluate(() => document.fonts.ready);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content:
        'html { scroll-behavior: auto !important; } nextjs-portal { display: none !important; }',
    });
    await page.locator("img").evaluateAll(async (images) => {
      for (const image of images) {
        if (image instanceof HTMLImageElement) {
          image.scrollIntoView({ block: "center" });
          await image.decode().catch(() => {});
        }
      }
      window.scrollTo(0, 0);
    });
    const dir = "artifacts/visual";
    await mkdir(dir, { recursive: true });
    const id = key.replaceAll("/", "-");
    await reference.screenshot({
      path: `${dir}/${id}-reference.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `${dir}/${id}-react.png`, fullPage: true });
    expect(await page.locator("body").innerText()).toContain("Portal Kontrol");
    await writeFile(
      `${dir}/${id}-measurements.json`,
      JSON.stringify(
        {
          reference: await reference
            .locator("[data-pencil-name]")
            .first()
            .boundingBox(),
          react: await page.locator("[data-screen]").first().boundingBox(),
        },
        null,
        2,
      ),
    );
    if (key !== "cms/login-admin") {
      const measure = () =>
        Array.from(document.querySelectorAll<HTMLElement>("[data-pencil-name]"))
          .filter(
            (element) =>
              element.children.length === 0 &&
              element.innerText.trim() &&
              !element.closest(
                "header, aside, [data-pencil-name='header'], [data-pencil-name='aside']",
              ),
          )
          .map((element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const box = range.getBoundingClientRect();
            return {
              name: element.getAttribute("data-pencil-name")!,
              text: element.innerText.trim(),
              x: box.x,
              y: box.y,
              width: box.width,
              height: box.height,
            };
          });
      const original = await reference.evaluate(measure);
      const current = await page.evaluate(measure);
      const pairs = original.flatMap((sample) => {
        const matches = current.filter(
          (value) => value.name === sample.name && value.text === sample.text,
        );
        return matches.length === 1
          ? [{ original: sample, current: matches[0] }]
          : [];
      });
      const stable = pairs.filter((pair) =>
        ["x", "y", "width", "height"].every(
          (field) =>
            Math.abs(
              pair.original[field as "x"] - pair.current[field as "x"],
            ) <= 1,
        ),
      );
      await writeFile(
        `${dir}/${id}-geometry.json`,
        JSON.stringify(
          {
            samples: pairs.length,
            identicalWithinOnePixel: stable.length,
            ratio: stable.length / pairs.length,
            deviations: pairs.filter((pair) => !stable.includes(pair)),
          },
          null,
          2,
        ),
      );
      expect(pairs.length).toBeGreaterThan(30);
      expect(stable.length / pairs.length).toBeGreaterThanOrEqual(0.9);
    }
    await reference.close();
  });
}
