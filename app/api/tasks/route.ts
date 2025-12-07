import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tasks, taskTags, tags } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth/proxy'
import { createTaskSchema, CreateTaskInput } from '@/lib/validations/task'

// GET /api/tasks - List all tasks for authenticated user
async function getTasks(user: any, request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let whereCondition: any = eq(tasks.userId, user.userId)

    if (status && ['todo', 'in_progress', 'completed'].includes(status)) {
      whereCondition = and(eq(tasks.userId, user.userId), eq(tasks.status, status as any))
    }

    const userTasks = await db
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
      .where(whereCondition)
      .orderBy(desc(tasks.createdAt))

    // Group tags by task
    const tasksWithTags = userTasks.reduce((acc, row) => {
      const task = acc.find(t => t.id === row.id)
      if (task) {
        if (row.tags) {
          task.tags.push(row.tags)
        }
      } else {
        acc.push({
          id: row.id,
          title: row.title,
          description: row.description,
          status: row.status,
          priority: row.priority,
          startDate: row.startDate,
          dueDate: row.dueDate,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          completedAt: row.completedAt,
          tags: row.tags ? [row.tags] : [],
        })
      }
      return acc
    }, [] as any[])

    return NextResponse.json(tasksWithTags)
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
async function createTask(user: any, request: NextRequest) {
  try {
    const body: CreateTaskInput = await request.json()

    // Validate input
    const validation = createTaskSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { title, description, status, priority, startDate, dueDate, tagIds } = validation.data

    // Create task
    const newTask = await db
      .insert(tasks)
      .values({
        userId: user.userId,
        title,
        description: description || null,
        status: status || 'todo',
        priority: priority || 'medium',
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .returning()

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      const tagInserts = tagIds.map(tagId => ({
        taskId: newTask[0].id,
        tagId,
      }))
      await db.insert(taskTags).values(tagInserts)
    }

    return NextResponse.json(newTask[0], { status: 201 })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(getTasks)
export const POST = requireAuth(createTask)