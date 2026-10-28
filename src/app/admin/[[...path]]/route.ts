export function GET() {
  return Response.json({
    code: 'ADMIN_NOT_IMPLEMENTED',
    message: 'Dashboard admin custom belum diimplementasikan. Login dan operasi admin tidak tersedia.',
  }, {
    status: 503,
    headers: { 'Cache-Control': 'no-store' },
  })
}
