import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tags } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth/proxy'

interface CreateTagInput {
  name: string
  color?: string
}

// GET /api/tags - List all tags for authenticated user
async function getTags(user: any, request: NextRequest) {
  try {
    const userTags = await db
      .select()
      .from(tags)
      .where(eq(tags.userId, user.userId))
      .orderBy(tags.name)

    return NextResponse.json(userTags)
  } catch (error) {
    console.error('Get tags error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tags - Create a new tag
async function createTag(user: any, request: NextRequest) {
  try {
    const body: CreateTagInput = await request.json()

    const { name, color } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    // Create tag
    const newTag = await db
      .insert(tags)
      .values({
        userId: user.userId,
        name: name.trim(),
        color: color || null,
      })
      .returning()

    return NextResponse.json(newTag[0], { status: 201 })
  } catch (error) {
    console.error('Create tag error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getTags)
export const POST = requireAuth(createTag)