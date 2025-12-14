'use client'

import { Task, TaskStatus, TaskPriority } from '@/types/task'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle } from 'lucide-react'
import { TagBadge } from '@/components/tags/tag-badge'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  filter: TaskStatus | 'all'
  onFilterChange: (filter: TaskStatus | 'all') => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusToggle?: (taskId: string, newStatus: TaskStatus) => void
  viewMode?: 'list' | 'grid' | 'compact'
  onViewModeChange?: (viewMode: 'list' | 'grid' | 'compact') => void
}

export function TaskList({ tasks, loading, filter, onFilterChange, onEdit, onDelete, onStatusToggle, viewMode = 'list', onViewModeChange }: TaskListProps) {
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
      {/* View Mode Controls */}
      {onViewModeChange && (
        <div className="flex gap-2 justify-end">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'compact' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('compact')}
          >
            Compact
          </Button>
        </div>
      )}

      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}`}>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks found.</p>
            <p className="text-sm">Create your first task to get started.</p>
          </div>
        ) : (
          tasks.map((task) => {
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
          return (
            <div key={task.id} className={`border border-border rounded-lg p-4 shadow-sm ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {onStatusToggle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 w-6"
                        onClick={() => onStatusToggle(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    )}
                    <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </h3>
                  </div>
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
                      <TagBadge key={tag.id} tag={tag} size="sm" />
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
          )
        })
        )}
      </div>
    </div>
  )
}