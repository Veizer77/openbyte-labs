import React from 'react'
import Link from 'next/link'
import type { Payload, TypedUser } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { formatWibDateTime, getWibMonthRange } from '@/lib/format/date'

interface DashboardProps {
  payload?: Payload
  user?: TypedUser | null
}

export async function Dashboard(props: DashboardProps) {
  let payload = props.payload
  if (!payload) {
    try {
      payload = await getPayload({ config: await configPromise })
    } catch {
      return null
    }
  }

  const user = props.user
  const isOwner = Boolean(user?.roles?.includes('owner'))
  const isEditor = Boolean(user?.roles?.includes('editor'))

  if (!isOwner && !isEditor) {
    return null
  }

  // 1. Ambil data proyek untuk seluruh peran admin (owner & editor)
  let publishedProjectsCount = 0
  try {
    const projectsResult = await payload.count({
      collection: 'projects',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { publishedAt: { less_than_equal: new Date().toISOString() } },
        ],
      },
      overrideAccess: true,
    })
    publishedProjectsCount = projectsResult.totalDocs
  } catch {
    publishedProjectsCount = 0
  }

  // Jika hanya editor, tampilkan tampilan ringkas konten tanpa data operasional
  if (!isOwner) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Dasbor Konten Website
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-150, #e5e7eb)',
              backgroundColor: 'var(--theme-elevation-50, #f9fafb)',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-500, #6b7280)' }}>
              Proyek Portofolio Terbit
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, marginTop: '0.5rem' }}>
              {publishedProjectsCount}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. Data operasional khusus owner
  let bookingsThisMonth = 0
  let newInquiriesCount = 0
  let newQuotesCount = 0
  let pendingBookings: Array<{ id: string | number; reference: string; name: string; slotStart: string; createdAt: string }> = []
  let newInquiries: Array<{ id: string | number; reference: string; name: string; whatsapp: string; createdAt: string }> = []
  let newQuotes: Array<{ id: string | number; reference: string; contactName?: string | null; priceMin?: number | null; priceMax?: number | null; createdAt: string }> = []
  let recentBookings: Array<{ id: string | number; reference: string; name: string; slotStart: string; status: string; createdAt: string }> = []
  let recentInquiries: Array<{ id: string | number; reference: string; name: string; status: string; createdAt: string }> = []

  try {
    const { startUtc, endUtc } = getWibMonthRange()

    const [
      bookingsMonthRes,
      inquiriesCountRes,
      quotesCountRes,
      pendingBookingsRes,
      newInquiriesRes,
      newQuotesRes,
      recentBookingsRes,
      recentInquiriesRes,
    ] = await Promise.all([
      payload.count({
        collection: 'consultation-bookings',
        where: {
          and: [
            { createdAt: { greater_than_equal: startUtc } },
            { createdAt: { less_than: endUtc } },
          ],
        },
        overrideAccess: true,
      }),
      payload.count({
        collection: 'inquiries',
        where: { status: { equals: 'new' } },
        overrideAccess: true,
      }),
      payload.count({
        collection: 'quote-requests',
        where: { status: { equals: 'new' } },
        overrideAccess: true,
      }),
      payload.find({
        collection: 'consultation-bookings',
        where: { status: { equals: 'pending' } },
        sort: '-createdAt',
        limit: 10,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'inquiries',
        where: { status: { equals: 'new' } },
        sort: '-createdAt',
        limit: 10,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'quote-requests',
        where: { status: { equals: 'new' } },
        sort: '-createdAt',
        limit: 10,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'consultation-bookings',
        sort: '-createdAt',
        limit: 5,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'inquiries',
        sort: '-createdAt',
        limit: 5,
        depth: 0,
        overrideAccess: true,
      }),
    ])

    bookingsThisMonth = bookingsMonthRes.totalDocs
    newInquiriesCount = inquiriesCountRes.totalDocs
    newQuotesCount = quotesCountRes.totalDocs
    pendingBookings = pendingBookingsRes.docs as typeof pendingBookings
    newInquiries = newInquiriesRes.docs as typeof newInquiries
    newQuotes = newQuotesRes.docs as unknown as typeof newQuotes
    recentBookings = recentBookingsRes.docs as typeof recentBookings
    recentInquiries = recentInquiriesRes.docs as typeof recentInquiries
  } catch (error) {
    console.error('Gagal mengambil data operasional dashboard admin:', error)
  }

  const totalActionNeeded = pendingBookings.length + newInquiries.length + newQuotes.length

  return (
    <div style={{ marginBottom: '2.5rem', fontFamily: 'inherit' }}>
      {/* 1. Stat Cards Ringkasan */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Ringkasan Operasional (WIB)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-150, #e5e7eb)',
              backgroundColor: 'var(--theme-elevation-50, #f9fafb)',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-500, #6b7280)' }}>
              Proyek Ditampilkan
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, marginTop: '0.35rem' }}>
              {publishedProjectsCount}
            </div>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-150, #e5e7eb)',
              backgroundColor: 'var(--theme-elevation-50, #f9fafb)',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-500, #6b7280)' }}>
              Booking Baru Bulan Ini (WIB)
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, marginTop: '0.35rem' }}>
              {bookingsThisMonth}
            </div>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-150, #e5e7eb)',
              backgroundColor: 'var(--theme-elevation-50, #f9fafb)',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-500, #6b7280)' }}>
              Inquiry / Quote Belum Dihubungi
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, marginTop: '0.35rem', color: (newInquiriesCount + newQuotesCount) > 0 ? '#b91c1c' : 'inherit' }}>
              {newInquiriesCount + newQuotesCount}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Panel Perlu Tindakan */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1.25rem',
          borderRadius: '8px',
          border: totalActionNeeded > 0 ? '1px solid #fca5a5' : '1px solid var(--theme-elevation-150, #e5e7eb)',
          backgroundColor: totalActionNeeded > 0 ? 'var(--theme-elevation-25, #fff5f5)' : 'var(--theme-elevation-50, #f9fafb)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: totalActionNeeded > 0 ? '#991b1b' : 'inherit' }}>
            Panel Perlu Tindakan {totalActionNeeded > 0 ? `(${totalActionNeeded})` : ''}
          </h3>
          <span style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-500, #6b7280)' }}>
            Booking pending & inquiry/quote status new
          </span>
        </div>

        {totalActionNeeded === 0 ? (
          <div style={{ padding: '1rem 0', color: 'var(--theme-elevation-500, #6b7280)', fontSize: '0.875rem' }}>
            Semua booking dan inquiry telah ditindaklanjuti. Tidak ada antrean tindakan.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Booking Pending */}
            {pendingBookings.map((b) => (
              <div
                key={`bkg-${b.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--theme-elevation-0, #ffffff)',
                  border: '1px solid var(--theme-elevation-150, #e5e7eb)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>[Booking Pending]</span>
                  <span>{b.reference} — {b.name}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-500, #6b7280)', marginTop: '0.2rem' }}>
                    Jadwal: {formatWibDateTime(b.slotStart)}
                  </div>
                </div>
                <div>
                  <Link
                    href={`/admin/collections/consultation-bookings/${b.id}`}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8125rem',
                      borderRadius: '4px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Konfirmasi Booking
                  </Link>
                </div>
              </div>
            ))}

            {/* Inquiry New */}
            {newInquiries.map((inq) => (
              <div
                key={`inq-${inq.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--theme-elevation-0, #ffffff)',
                  border: '1px solid var(--theme-elevation-150, #e5e7eb)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>[Inquiry Baru]</span>
                  <span>{inq.reference} — {inq.name}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-500, #6b7280)', marginTop: '0.2rem' }}>
                    Masuk: {formatWibDateTime(inq.createdAt)}
                  </div>
                </div>
                <div>
                  <Link
                    href={`/admin/collections/inquiries/${inq.id}`}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8125rem',
                      borderRadius: '4px',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Buka & Hubungi
                  </Link>
                </div>
              </div>
            ))}

            {/* Quote Requests New */}
            {newQuotes.map((qte) => (
              <div
                key={`qte-${qte.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--theme-elevation-0, #ffffff)',
                  border: '1px solid var(--theme-elevation-150, #e5e7eb)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>[Quote Baru]</span>
                  <span>{qte.reference} — {qte.contactName ?? 'Tanpa Nama'}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-500, #6b7280)', marginTop: '0.2rem' }}>
                    Masuk: {formatWibDateTime(qte.createdAt)}
                  </div>
                </div>
                <div>
                  <Link
                    href={`/admin/collections/quote-requests/${qte.id}`}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8125rem',
                      borderRadius: '4px',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Buka & Hubungi
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Tabel Ringkasan Terbaru */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* 5 Booking Terbaru */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--theme-elevation-150, #e5e7eb)',
            backgroundColor: 'var(--theme-elevation-50, #f9fafb)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontWeight: 600, fontSize: '0.9375rem' }}>5 Booking Terbaru</h4>
            <Link href="/admin/collections/consultation-bookings" style={{ fontSize: '0.8125rem', color: '#2563eb' }}>
              Lihat semua →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div style={{ fontSize: '0.8125rem', color: 'var(--theme-elevation-500, #6b7280)' }}>Belum ada booking.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentBookings.map((b) => (
                <div key={`rc-bkg-${b.id}`} style={{ fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    <Link href={`/admin/collections/consultation-bookings/${b.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <strong>{b.reference}</strong> ({b.name})
                    </Link>
                  </span>
                  <span style={{ color: 'var(--theme-elevation-500, #6b7280)' }}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5 Inquiry Terbaru */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--theme-elevation-150, #e5e7eb)',
            backgroundColor: 'var(--theme-elevation-50, #f9fafb)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontWeight: 600, fontSize: '0.9375rem' }}>5 Inquiry Terbaru</h4>
            <Link href="/admin/collections/inquiries" style={{ fontSize: '0.8125rem', color: '#2563eb' }}>
              Lihat semua →
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <div style={{ fontSize: '0.8125rem', color: 'var(--theme-elevation-500, #6b7280)' }}>Belum ada inquiry.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentInquiries.map((inq) => (
                <div key={`rc-inq-${inq.id}`} style={{ fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    <Link href={`/admin/collections/inquiries/${inq.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <strong>{inq.reference}</strong> ({inq.name})
                    </Link>
                  </span>
                  <span style={{ color: 'var(--theme-elevation-500, #6b7280)' }}>{inq.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Dashboard
