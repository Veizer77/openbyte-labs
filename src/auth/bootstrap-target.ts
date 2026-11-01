import "server-only";

/** Confirms a target without printing or returning the connection URL. */
export function validateBootstrapTarget(
  uri: string,
  approvedTarget: string,
): { host: string; database: string } {
  let url: URL;
  try {
    url = new URL(uri);
  } catch {
    throw new Error("Koneksi database tidak valid.");
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol))
    throw new Error("Koneksi database tidak valid.");
  let database: string;
  try {
    database = decodeURIComponent(url.pathname.slice(1));
  } catch {
    throw new Error("Nama database tidak valid.");
  }
  if (!url.hostname || !database || /[\/\\\u0000-\u001f\u007f]/.test(database))
    throw new Error("Target database tidak valid.");
  const host = url.host.toLowerCase();
  if (`${host}/${database}` !== approvedTarget.trim())
    throw new Error("Target database belum dikonfirmasi.");
  return { host, database };
}
