import { sign, verify } from 'jsonwebtoken'

const secret = process.env.JWT_SECRET
if (!secret) {
  throw new Error('JWT_SECRET environment variable is not set')
}
const JWT_SECRET = secret
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  fullName: string
}

export function signToken(payload: JWTPayload): string {
  return (sign as any)(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return (verify as any)(token, JWT_SECRET) as unknown as JWTPayload
  } catch (_error) {
    return null
  }
}