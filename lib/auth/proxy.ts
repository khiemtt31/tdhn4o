import { NextRequest } from 'next/server'
import { verifyToken, JWTPayload } from './jwt'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export interface AuthUser extends JWTPayload {
  // Additional fields can be added here
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    // Verify user still exists in database
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (user.length === 0) {
      return null
    }

    return {
      userId: user[0].id,
      email: user[0].email,
      fullName: user[0].fullName,
    }
  } catch (error) {
    console.error('Auth proxy error:', error)
    return null
  }
}

export function requireAuth(handler: (user: AuthUser, request: NextRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request)

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return handler(user, request)
  }
}