/**
 * Penanda mode pratinjau (F2-04). Selalu terlihat di atas konten draft dan
 * menyediakan jalan keluar yang mematikan cookie Draft Mode.
 *
 * Keluar memakai POST, bukan tautan: `next/link` akan melakukan prefetch dan
 * dapat mematikan pratinjau sebelum pengguna menekannya.
 */
export function PreviewBanner({ label }: { label: string }) {
  return (
    <div className="preview-banner" role="status">
      <span>{label}</span>
      <span className="preview-banner__actions">
        <form action="/api/draft/exit" method="post">
          <button type="submit">Keluar pratinjau</button>
        </form>
      </span>
    </div>
  )
}
