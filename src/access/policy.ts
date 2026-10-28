import type { Actor, Operation, Resource } from './types'

/**
 * Default-deny policy engine.
 * Menegakkan matriks otorisasi PRD v1.5 Bagian 5.4.
 */
export function canAccess(actor: Actor, resource: Resource, operation: Operation): boolean {
  // 1. Tracking portal selalu 404/DITOLAK pada Rilis 1
  if (resource === 'tracking_portal') {
    return false
  }

  // 2. Akses Publik
  if (resource === 'public_content') {
    if (operation === 'read') return true
    // Mutasi public content hanya boleh dilakukan oleh authenticated admin
    if (actor.type === 'authenticated') return true
    return false
  }

  if (resource === 'public_submission') {
    // Publik boleh membuat submission (inquiry, booking), tapi hanya create
    if (operation === 'create') return true
    // Read/update submission masuk kategori operational_data
    return false
  }

  // 3. Password-only (belum lolos TOTP): DITOLAK dari semua resource admin & operasional
  if (actor.type === 'password_only') {
    return false
  }

  // 4. Anonymous: Ditolak dari semua resource admin
  if (actor.type === 'anonymous') {
    return false
  }

  // 5. Authenticated Users (Owner / Editor dengan TOTP lengkap)
  if (actor.type === 'authenticated') {
    const { role } = actor

    // Admin Portal Root Access
    if (resource === 'admin_portal') {
      return true
    }

    // Website Content (Proyek, Layanan, Testimoni, FAQ)
    if (resource === 'website_content') {
      if (operation === 'read' || operation === 'create' || operation === 'update' || operation === 'publish') {
        return true
      }
      if (operation === 'delete') {
        // Hanya owner yang boleh hard delete konten
        return role === 'owner'
      }
      return false
    }

    // Operasional Klien (Inquiries, Quote Requests, Booking Konsultasi)
    // Editor DILARANG mengakses data operasional
    if (resource === 'operational_data') {
      return role === 'owner'
    }

    // Sistem & Pengaturan (Site Settings, WhatsApp, Manajemen Staf)
    // Editor DILARANG mengakses sistem/pengaturan
    if (resource === 'system_settings') {
      return role === 'owner'
    }

    // Audit Logs
    // Editor DILARANG mengakses audit logs
    if (resource === 'audit_logs') {
      return role === 'owner'
    }
  }

  // Default Deny
  return false
}

/**
 * Guard pembantu yang melempar error aman jika otorisasi ditolak.
 */
export function assertAccess(actor: Actor, resource: Resource, operation: Operation): void {
  if (!canAccess(actor, resource, operation)) {
    throw new Error(`Akses ditolak: ${actor.type} tidak memiliki izin ${operation} pada ${resource}`)
  }
}
