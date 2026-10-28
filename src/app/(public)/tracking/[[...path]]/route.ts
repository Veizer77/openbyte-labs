export function GET() {
  return Response.json({ message: 'Halaman tidak ditemukan.' }, {
    status: 404,
    headers: { 'Cache-Control': 'no-store' },
  })
}
