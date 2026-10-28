export async function checkHealth(probe: () => Promise<unknown>): Promise<Response> {
  const headers = { 'Cache-Control': 'no-store' }
  try {
    await probe()
    return Response.json({ status: 'ok', database: 'up' }, { status: 200, headers })
  } catch {
    return Response.json({ status: 'unavailable', database: 'down' }, { status: 503, headers })
  }
}
