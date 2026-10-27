import type { Metadata } from 'next'
import { PackagesView } from '@/components/pages/packages-view'
import { getPackagesViewData } from '@/server/content'

/** Batas kesegaran PRD 60 detik (F3-04): harga diskon mengikuti `discountEndsAt`. */
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Paket Layanan',
  description: 'Paket layanan dan opsi tambahan OpenByte Labs.',
  alternates: { canonical: '/paket' },
  openGraph: {
    title: 'Paket Layanan OpenByte Labs',
    description: 'Pilihan paket layanan untuk website, sistem informasi, dan aplikasi mobile.',
    type: 'website',
    url: '/paket',
  },
}

export default async function PackagesPage() {
  const { packages, addons } = await getPackagesViewData()

  return <PackagesView packages={packages} addons={addons} />
}
