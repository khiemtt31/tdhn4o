'use client'

import { useEffect, useState } from 'react'
import { Task, TaskStatus, TaskPriority } from '@/types/task'
import { Button } from '@/components/ui/button'

interface TaskListProps {
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

export function TaskList({ onEdit, onDelete }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')

  const fetchTasks = async (status?: TaskStatus) => {
    try {
      const url = status ? `/api/tasks?status=${status}` : '/api/tasks'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks(filter === 'all' ? undefined : filter)
  }, [filter])

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'tag--status-todo'
      case 'in_progress': return 'tag--status-in_progress'
      case 'completed': return 'tag--status-completed'
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low': return 'tag--priority-low'
      case 'medium': return 'tag--priority-medium'
      case 'high': return 'tag--priority-high'
    }
  }

  if (loading) {
    return <div>Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'todo' ? 'default' : 'outline'}
          onClick={() => setFilter('todo')}
        >
          To Do
        </Button>
        <Button
          variant={filter === 'in_progress' ? 'default' : 'outline'}
          onClick={() => setFilter('in_progress')}
        >
          In Progress
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks found.</p>
            <p className="text-sm">Create your first task to get started.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="border border-border rounded-lg p-4 shadow-sm">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {task.tags.map((tag) => (
                      <span key={tag.id} className="px-2 py-1 border rounded text-xs text-foreground" style={{ borderColor: tag.color }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="outline" size="sm" onClick={() => onDelete(task.id)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                {task.dueDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}