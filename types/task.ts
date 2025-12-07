export type TaskStatus = 'todo' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Tag {
  id: string
  name: string
  color?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  startDate?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  tags: Tag[]
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  startDate?: string
  dueDate?: string
  tagIds?: string[]
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}