'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TagBadgeProps {
  tag: {
    id: string
    name: string
    color?: string
  }
  onRemove?: () => void
  size?: 'sm' | 'md'
  showRemove?: boolean
}

export function TagBadge({ tag, onRemove, size = 'md', showRemove = false }: TagBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
        borderColor: tag.color || '#d1d5db',
        color: tag.color || '#374151',
      }}
    >
      {tag.name}
      {showRemove && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </span>
  )
}