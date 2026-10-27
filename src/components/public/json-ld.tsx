/**
 * JSON-LD aman (F3-05).
 *
 * `JSON.stringify` saja tidak cukup: nilai berisi `</script>` dapat menutup
 * tag. Semua `<` di-escape menjadi `\u003c` sehingga skrip tidak pernah bisa
 * keluar dari elemen, dan rich text mentah tidak pernah dimasukkan ke sini.
 */
export function serializeJsonLd(value: Record<string, unknown>): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
}

export function JsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(value) }} />
  )
}
