import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tags, taskTags } from '@/lib/db/schema'
import { eq, ilike, sql } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth/proxy'
import { createTagSchema } from '@/lib/validations/tag'

// PATCH /api/tags/:id - Update a tag
async function updateTag(user: any, request: NextRequest, tagId: string) {
  try {
    const body = await request.json()

    // Validate input
    const validation = createTagSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { name, color } = validation.data

    // Check if tag exists and belongs to user
    const existingTag = await db
      .select()
      .from(tags)
      .where(eq(tags.id, tagId))
      .where(eq(tags.userId, user.userId))

    if (existingTag.length === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // Check for name conflict if name is being changed
    if (name && name !== existingTag[0].name) {
      const conflictingTag = await db
        .select()
        .from(tags)
        .where(eq(tags.userId, user.userId))
        .where(ilike(tags.name, name))
        .where(sql`${tags.id} != ${tagId}`)

      if (conflictingTag.length > 0) {
        return NextResponse.json(
          { error: 'Tag with this name already exists' },
          { status: 409 }
        )
      }
    }

    // Update tag
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (color !== undefined) updateData.color = color

    const updatedTag = await db
      .update(tags)
      .set(updateData)
      .where(eq(tags.id, tagId))
      .returning()

    return NextResponse.json(updatedTag[0])
  } catch (error) {
    console.error('Update tag error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tags/:id - Delete a tag
async function deleteTag(user: any, request: NextRequest, tagId: string) {
  try {
    // Check if tag exists and belongs to user
    const existingTag = await db
      .select()
      .from(tags)
      .where(eq(tags.id, tagId))
      .where(eq(tags.userId, user.userId))

    if (existingTag.length === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // Delete tag (cascade will handle task_tags)
    await db
      .delete(tags)
      .where(eq(tags.id, tagId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete tag error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const PATCH = requireAuth(updateTag)
export const DELETE = requireAuth(deleteTag)