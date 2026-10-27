import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'

export function hashClientIp(ip: string, salt: string | undefined): string {
  if (!salt?.trim()) throw new Error('IP hash salt is not configured')
  if (isIP(ip) === 0) throw new Error('Client IP is invalid')
  return createHmac('sha256', salt).update(`client-ip:${ip}`).digest('hex')
}

export function createPublicFormRateLimitKey(ip: string, salt: string | undefined): string {
  if (!salt?.trim()) throw new Error('IP hash salt is not configured')
  if (isIP(ip) === 0) throw new Error('Client IP is invalid')
  return createHmac('sha256', salt).update(`rate-limit:public-form:${ip}`).digest('hex')
}
