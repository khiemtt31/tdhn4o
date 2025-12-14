import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tasks, taskTags, tags } from '@/lib/db/schema'
import { eq, desc, and, or, ilike, sql, asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth/proxy'
import { createTaskSchema, CreateTaskInput } from '@/lib/validations/task'

// GET /api/tasks - List all tasks for authenticated user
async function getTasks(user: any, request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tagIds = searchParams.getAll('tagId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const dateFilter = searchParams.get('dateFilter')
    const customStartDate = searchParams.get('startDate')
    const customEndDate = searchParams.get('endDate')

    let whereCondition: any = eq(tasks.userId, user.userId)

    // Status filter
    if (status && ['todo', 'in_progress', 'completed'].includes(status)) {
      whereCondition = and(whereCondition, eq(tasks.status, status as any))
    }

    // Tag filter
    if (tagIds.length > 0) {
      // For tag filtering, we need tasks that have ANY of the specified tags
      whereCondition = and(
        whereCondition,
        sql`${tasks.id} IN (
          SELECT ${taskTags.taskId}
          FROM ${taskTags}
          WHERE ${taskTags.tagId} IN (${tagIds.map(id => `'${id}'`).join(', ')})
        )`
      )
    }

    // Search filter
    if (search) {
      whereCondition = and(
        whereCondition,
        or(
          ilike(tasks.title, `%${search}%`),
          ilike(tasks.description, `%${search}%`)
        )
      )
    }

    // Date filter
    const now = new Date()
    if (dateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      whereCondition = and(
        whereCondition,
        sql`${tasks.dueDate} >= ${today.toISOString()} AND ${tasks.dueDate} < ${tomorrow.toISOString()}`
      )
    } else if (dateFilter === 'upcoming') {
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)
      whereCondition = and(
        whereCondition,
        sql`${tasks.dueDate} >= ${now.toISOString()} AND ${tasks.dueDate} <= ${nextWeek.toISOString()}`
      )
    } else if (dateFilter === 'overdue') {
      whereCondition = and(
        whereCondition,
        sql`${tasks.dueDate} < ${now.toISOString()}`
      )
    } else if (dateFilter === 'custom' && customStartDate && customEndDate) {
      whereCondition = and(
        whereCondition,
        sql`${tasks.dueDate} >= ${customStartDate} AND ${tasks.dueDate} <= ${customEndDate}`
      )
    }

    // Build order by clause
    let orderByClause: any
    switch (sortBy) {
      case 'dueDate':
        orderByClause = sortOrder === 'asc' ? asc(tasks.dueDate) : desc(tasks.dueDate)
        break
      case 'priority':
        orderByClause = sortOrder === 'asc' ? asc(tasks.priority) : desc(tasks.priority)
        break
      case 'status':
        orderByClause = sortOrder === 'asc' ? asc(tasks.status) : desc(tasks.status)
        break
      case 'title':
        orderByClause = sortOrder === 'asc' ? asc(tasks.title) : desc(tasks.title)
        break
      default:
        orderByClause = sortOrder === 'asc' ? asc(tasks.createdAt) : desc(tasks.createdAt)
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
      .orderBy(orderByClause)

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