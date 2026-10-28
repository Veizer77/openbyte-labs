export type Role = 'owner' | 'editor'

export type Actor =
  | { type: 'anonymous' }
  | { type: 'password_only'; userId: string; email: string }
  | { type: 'authenticated'; userId: string; email: string; role: Role }

export type Resource =
  | 'public_content'
  | 'public_submission'
  | 'admin_portal'
  | 'website_content'
  | 'operational_data'
  | 'system_settings'
  | 'audit_logs'
  | 'tracking_portal'

export type Operation = 'read' | 'create' | 'update' | 'delete' | 'publish'
