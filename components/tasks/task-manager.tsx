'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Task, CreateTaskInput, TaskStatus, TaskFilters as TaskFiltersType } from '@/types/task'
import { TaskList } from './task-list'
import { TaskForm } from './task-form'
import { TaskFilters } from './task-filters'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { QUERY_KEYS } from '@/lib/query-keys'

export function TaskManager() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [filters, setFilters] = useState<TaskFiltersType>({})
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>('list')
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Build query string from filters
  const buildQueryString = (filters: any) => {
    const params = new URLSearchParams()

    if (filters.status) params.append('status', filters.status)
    if (filters.tagIds?.length) {
      filters.tagIds.forEach((id: string) => params.append('tagId', id))
    }
    if (filters.search) params.append('search', filters.search)
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
    if (filters.dateFilter) params.append('dateFilter', filters.dateFilter)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)

    return params.toString()
  }

  // Fetch tasks with filters
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.tasks, filters],
    queryFn: async () => {
      const queryString = buildQueryString(filters)
      const url = queryString ? `/api/tasks?${queryString}` : '/api/tasks'
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      return response.json()
    },
  })

  // Create task mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create task')
      return response.json()
    },
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.tasks, filters] })

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData([QUERY_KEYS.tasks, filters])

      // Optimistically update to the new value
      const optimisticTask = {
        id: `temp-${Date.now()}`, // Temporary ID
        title: newTask.title,
        description: newTask.description || null,
        status: newTask.status || 'todo',
        priority: newTask.priority || 'medium',
        startDate: newTask.startDate ? new Date(newTask.startDate) : null,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
        tags: [], // We'll handle tags separately if needed
      }

      queryClient.setQueryData([QUERY_KEYS.tasks, filters], (old: Task[] = []) => [optimisticTask, ...old])

      // Return a context object with the snapshotted value
      return { previousTasks }
    },
    onError: (err, newTask, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData([QUERY_KEYS.tasks, filters], context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tasks] })
    },
    onSuccess: () => {
      setFormOpen(false)
    },
  })

  // Update task mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateTaskInput }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update task')
      return response.json()
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.tasks, filters] })

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData([QUERY_KEYS.tasks, filters])

      // Optimistically update the task
      queryClient.setQueryData([QUERY_KEYS.tasks, filters], (old: Task[] = []) =>
        old.map(task =>
          task.id === id
            ? {
                ...task,
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : null,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                updatedAt: new Date().toISOString(),
                completedAt: data.status === 'completed' && task.status !== 'completed'
                  ? new Date().toISOString()
                  : data.status !== 'completed'
                  ? null
                  : task.completedAt
              }
            : task
        )
      )

      // Return a context object with the snapshotted value
      return { previousTasks }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData([QUERY_KEYS.tasks, filters], context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tasks] })
    },
    onSuccess: () => {
      setFormOpen(false)
    },
  })

  // Status toggle mutation with optimistic updates
  const statusToggleMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Failed to update task status (${response.status})`)
      }
      return response.json()
    },
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.tasks, filters] })

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData([QUERY_KEYS.tasks, filters])

      // Optimistically update the task status
      queryClient.setQueryData([QUERY_KEYS.tasks, filters], (old: Task[] = []) =>
        old.map(task =>
          task.id === id
            ? {
                ...task,
                status,
                completedAt: status === 'completed' ? new Date().toISOString() : null,
                updatedAt: new Date().toISOString()
              }
            : task
        )
      )

      // Return a context object with the snapshotted value
      return { previousTasks }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData([QUERY_KEYS.tasks, filters], context.previousTasks)
      }
      setError(err instanceof Error ? err.message : 'An error occurred')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tasks] })
    },
    onSuccess: () => {
      setError(null)
    },
  })

  // Delete task mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete task')
    },
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.tasks, filters] })

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData([QUERY_KEYS.tasks, filters])

      // Optimistically remove the task
      queryClient.setQueryData([QUERY_KEYS.tasks, filters], (old: Task[] = []) =>
        old.filter(task => task.id !== taskId)
      )

      // Return a context object with the snapshotted value
      return { previousTasks }
    },
    onError: (err, taskId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData([QUERY_KEYS.tasks, filters], context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tasks] })
    },
  })

  const handleStatusToggle = async (taskId: string, newStatus: TaskStatus) => {
    await statusToggleMutation.mutateAsync({ id: taskId, status: newStatus })
  }

  const handleCreate = async (data: CreateTaskInput) => {
    await createMutation.mutateAsync(data)
  }

  const handleEdit = async (data: CreateTaskInput) => {
    if (!editingTask) return
    await updateMutation.mutateAsync({ id: editingTask.id, data })
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    await deleteMutation.mutateAsync(taskId)
  }

  const openCreateForm = () => {
    setEditingTask(undefined)
    setMode('create')
    setFormOpen(true)
  }

  const openEditForm = (task: Task) => {
    setEditingTask(task)
    setMode('edit')
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingTask(undefined)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={() => setError(null)} className="float-right ml-4">×</button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <Button onClick={openCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      <TaskList
        tasks={tasks}
        loading={isLoading}
        filter="all" // Keep for backward compatibility, but filters are now handled above
        onFilterChange={() => {}} // No-op since we use TaskFilters now
        onEdit={openEditForm}
        onDelete={handleDelete}
        onStatusToggle={handleStatusToggle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <TaskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={mode === 'create' ? handleCreate : handleEdit}
        task={editingTask}
        mode={mode}
      />
    </div>
  )
}