import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { appendFile, open, stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";

const MAGIC = Buffer.from("OBLBKP01");
const HEADER_SIZE = 8 + 16 + 12;
const TAG_SIZE = 16;
function key(password: string, salt: Buffer) {
  if (password.length < 32) throw new Error("Backup encryption key requires at least 32 characters.");
  return scryptSync(password, salt, 32);
}

export async function encryptBackup(source: string, destination: string, password: string) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const header = Buffer.concat([MAGIC, salt, iv]);
  const cipher = createCipheriv("aes-256-gcm", key(password, salt), iv);
  cipher.setAAD(header);
  const file = await open(destination, "wx", 0o600);
  try { await file.write(header); } finally { await file.close(); }
  await pipeline(createReadStream(source), cipher, createWriteStream(destination, { flags: "a", mode: 0o600 }));
  await appendFile(destination, cipher.getAuthTag());
}

/** Caller must use a private temporary directory and discard partial output on failure. */
export async function decryptBackup(source: string, destination: string, password: string) {
  const size = (await stat(source)).size;
  if (size < HEADER_SIZE + TAG_SIZE) throw new Error("Invalid backup envelope.");
  const handle = await open(source, "r");
  const header = Buffer.alloc(HEADER_SIZE);
  const tag = Buffer.alloc(TAG_SIZE);
  try {
    await handle.read(header, 0, header.length, 0);
    await handle.read(tag, 0, tag.length, size - TAG_SIZE);
  } finally { await handle.close(); }
  if (!header.subarray(0, 8).equals(MAGIC)) throw new Error("Unsupported backup format.");
  const cipher = createDecipheriv("aes-256-gcm", key(password, header.subarray(8, 24)), header.subarray(24, 36));
  cipher.setAAD(header);
  cipher.setAuthTag(tag);
  await pipeline(createReadStream(source, { start: HEADER_SIZE, end: size - TAG_SIZE - 1 }), cipher, createWriteStream(destination, { flags: "wx", mode: 0o600 }));
}
