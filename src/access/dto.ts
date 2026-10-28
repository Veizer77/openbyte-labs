import type { Role } from './types'

export interface UserDTO {
  id: string
  name: string
  email: string
  role: Role
  createdAt: Date
}

export function sanitizeUserDTO(raw: {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  authUserId?: string
  password?: string
  secret?: string
}): UserDTO {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role as Role,
    createdAt: raw.createdAt,
  }
}

export interface PublicSubmissionDTO {
  id: string
  referenceNumber: string
  status: string
  createdAt: Date
}

export function sanitizeSubmissionDTO(raw: {
  id: string
  referenceNumber: string
  status: string
  createdAt: Date
  internalNotes?: string
  clientIp?: string
}): PublicSubmissionDTO {
  return {
    id: raw.id,
    referenceNumber: raw.referenceNumber,
    status: raw.status,
    createdAt: raw.createdAt,
  }
}
