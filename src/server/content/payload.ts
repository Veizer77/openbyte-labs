/**
 * Klien Payload untuk lapisan baca server (F3-01).
 *
 * Modul ini hanya boleh diimpor dari Server Component / Route Handler /
 * Server Action. `src/lib/*` tidak mengimpornya.
 */

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

/** Instance Payload yang dipakai pembacaan konten publik. */
export function getContentPayload(): Promise<Payload> {
  return getPayload({ config })
}
