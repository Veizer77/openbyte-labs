import { readFile, readdir } from "node:fs/promises";

async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await scan(path);
    else if (/\.[cm]?[jt]sx?$/.test(path)) {
      const source = await readFile(path, "utf8");
      if (/from\s+["'](?:@payloadcms\/|payload["']|@vercel\/)/.test(source)) {
        throw new Error(`Dependency di luar stack PRD: ${path}`);
      }
      const reviewedVideoRenderer = path === "src/components/public/ProjectContent.tsx";
      if (/dangerouslySetInnerHTML/.test(source) || (/<iframe/.test(source) && !reviewedVideoRenderer)) {
        throw new Error(
          `Frontend harus berupa komponen React, bukan HTML/iframe: ${path}`,
        );
      }
    }
  }
}
await scan("src");
console.log("Batas dependency dan komponen React: OK");
