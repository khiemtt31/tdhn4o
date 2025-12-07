import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tasks, taskTags, tags } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth/middleware'
import { updateTaskSchema } from '@/lib/validations/task'

// GET /api/tasks/[id] - Get a single task
async function getTask(user: any, request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id

    const taskData = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        startDate: tasks.startDate,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        completedAt: tasks.completedAt,
        tags: {
          id: tags.id,
          name: tags.name,
          color: tags.color,
        },
      })
      .from(tasks)
      .leftJoin(taskTags, eq(tasks.id, taskTags.taskId))
      .leftJoin(tags, eq(taskTags.tagId, tags.id))
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.userId)))
      .limit(1)

    if (taskData.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Group tags
    const task = {
      id: taskData[0].id,
      title: taskData[0].title,
      description: taskData[0].description,
      status: taskData[0].status,
      priority: taskData[0].priority,
      startDate: taskData[0].startDate,
      dueDate: taskData[0].dueDate,
      createdAt: taskData[0].createdAt,
      updatedAt: taskData[0].updatedAt,
      completedAt: taskData[0].completedAt,
      tags: taskData.filter(row => row.tags).map(row => row.tags),
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Get task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[id] - Update a task
async function updateTask(user: any, request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id
    const body = await request.json()

    // Validate input
    const validation = updateTaskSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const updateData = validation.data

    // Check if task exists and belongs to user
    const existingTask = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.userId)))
      .limit(1)

    if (existingTask.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateFields: any = {
      updatedAt: new Date(),
    }

    if (updateData.title !== undefined) updateFields.title = updateData.title
    if (updateData.description !== undefined) updateFields.description = updateData.description
    if (updateData.status !== undefined) {
      updateFields.status = updateData.status
      if (updateData.status === 'completed') {
        updateFields.completedAt = new Date()
      } else if (existingTask[0].status === 'completed') {
        updateFields.completedAt = null
      }
    }
    if (updateData.priority !== undefined) updateFields.priority = updateData.priority
    if (updateData.startDate !== undefined) updateFields.startDate = updateData.startDate ? new Date(updateData.startDate) : null
    if (updateData.dueDate !== undefined) updateFields.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null

    // Update task
    const updatedTask = await db
      .update(tasks)
      .set(updateFields)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.userId)))
      .returning()

    // Handle tags if provided
    if (updateData.tagIds !== undefined) {
      // Delete existing tags
      await db
        .delete(taskTags)
        .where(eq(taskTags.taskId, taskId))

      // Add new tags
      if (updateData.tagIds.length > 0) {
        const tagInserts = updateData.tagIds.map((tagId: string) => ({
          taskId,
          tagId,
        }))
        await db.insert(taskTags).values(tagInserts)
      }
    }

    return NextResponse.json(updatedTask[0])
  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
async function deleteTask(user: any, request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id

    // Check if task exists and belongs to user
    const existingTask = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.userId)))
      .limit(1)

    if (existingTask.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Delete task (cascade will handle task_tags)
    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.userId)))

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAuth((user, req) => getTask(user, req, { params }))(request)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAuth((user, req) => updateTask(user, req, { params }))(request)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAuth((user, req) => deleteTask(user, req, { params }))(request)
}