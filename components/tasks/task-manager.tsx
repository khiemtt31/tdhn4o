'use client'

import { useState } from 'react'
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'
import { TaskList } from './task-list'
import { TaskForm } from './task-form'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  const refreshTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Failed to refresh tasks:', error)
    }
  }

  const handleCreate = async (data: CreateTaskInput) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      await refreshTasks()
    } else {
      throw new Error('Failed to create task')
    }
  }

  const handleEdit = async (data: CreateTaskInput) => {
    if (!editingTask) return
    const response = await fetch(`/api/tasks/${editingTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      await refreshTasks()
    } else {
      throw new Error('Failed to update task')
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      await refreshTasks()
    } else {
      console.error('Failed to delete task')
    }
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <Button onClick={openCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <TaskList
        onEdit={openEditForm}
        onDelete={handleDelete}
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