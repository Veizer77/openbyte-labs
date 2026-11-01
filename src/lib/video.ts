/** Convert only recognized provider IDs; query strings are never forwarded. */
export function videoEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (["youtube.com", "www.youtube.com", "youtu.be"].includes(url.hostname)) {
      const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.pathname === "/watch" ? url.searchParams.get("v") : /^\/(?:embed|shorts)\/([^/]+)$/.exec(url.pathname)?.[1];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (["vimeo.com", "player.vimeo.com"].includes(url.hostname)) {
      const id = /^\/(?:video\/)?(\d+)$/.exec(url.pathname)?.[1];
      return id ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
    }
  } catch { return null; }
  return null;
}
