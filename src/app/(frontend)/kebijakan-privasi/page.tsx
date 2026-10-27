import type { Metadata } from 'next'
import { LegalView } from '@/components/pages/legal-view'
import { collectRichText, containsUnpublishedPlaceholder } from '@/lib/content/blocks'
import { getPageViewData } from '@/server/content'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Informasi mengenai kebijakan privasi OpenByte Labs.',
  alternates: { canonical: '/kebijakan-privasi' },
  // Halaman legal baru boleh diindeks setelah isinya disetujui pemilik (F5-02).
  robots: { index: false, follow: false },
}

export default async function PrivacyPolicyPage() {
  const data = await getPageViewData('kebijakan-privasi')
  const hasPlaceholder = data ? containsUnpublishedPlaceholder(collectRichText(data.page)) : true

  return (
    <LegalView
      data={data}
      isPublished={Boolean(data) && !hasPlaceholder}
      title="Kebijakan Privasi"
      subtitle="Bagaimana informasi yang Anda berikan akan dikelola."
    />
  )
}
