import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  tagIds: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.startDate && data.dueDate) {
    return new Date(data.dueDate) > new Date(data.startDate)
  }
  return true
}, {
  message: 'Due date must be after start date',
  path: ['dueDate'],
})

export const updateTaskSchema = createTaskSchema.partial()

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>