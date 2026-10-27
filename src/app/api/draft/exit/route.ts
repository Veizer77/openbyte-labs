import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Keluar dari Draft Mode (F2-04). POST dipakai oleh tombol di banner pratinjau
 * agar prefetch tautan tidak mematikan pratinjau lebih awal; GET dipertahankan
 * untuk akses manual.
 */
async function exitDraftMode(): Promise<never> {
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}

export async function POST(): Promise<never> {
  return exitDraftMode()
}

export async function GET(): Promise<never> {
  return exitDraftMode()
}
