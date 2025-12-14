'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X, Calendar, Tag as TagIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { TagBadge } from '@/components/tags/tag-badge'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Tag } from '@/types/task'

interface TaskFilters {
  status?: string
  tagIds?: string[]
  search?: string
  sortBy?: string
  sortOrder?: string
  dateFilter?: string
  startDate?: string
  endDate?: string
}

interface TaskFiltersProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '')

  const [dateRange, setDateRange] = useState({
    start: filters.startDate || '',
    end: filters.endDate || '',
  })

  // Fetch tags
  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: QUERY_KEYS.tags,
    queryFn: async (): Promise<Tag[]> => {
      const response = await fetch('/api/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      return response.json()
    },
  })

  // Compute selected tags from filters and available tags
  const selectedTags = tags.filter(tag => filters.tagIds?.includes(tag.id) ?? false)

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? undefined : status
    })
  }

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some(selectedTag => selectedTag.id === tag.id)
    const newTagIds = isSelected
      ? filters.tagIds?.filter(id => id !== tag.id) ?? []
      : [...(filters.tagIds ?? []), tag.id]

    onFiltersChange({
      ...filters,
      tagIds: newTagIds.length > 0 ? newTagIds : undefined
    })
  }

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const handleSortOrderChange = (sortOrder: string) => {
    onFiltersChange({ ...filters, sortOrder })
  }

  const handleDateFilterChange = (dateFilter: string) => {
    const newFilters = { ...filters, dateFilter }

    if (dateFilter !== 'custom') {
      newFilters.startDate = undefined
      newFilters.endDate = undefined
      setDateRange({ start: '', end: '' })
    }

    onFiltersChange(newFilters)
  }

  const handleCustomDateChange = () => {
    onFiltersChange({
      ...filters,
      dateFilter: 'custom',
      startDate: dateRange.start || undefined,
      endDate: dateRange.end || undefined,
    })
  }

  const clearAllFilters = () => {
    setSearchInput('')
    setDateRange({ start: '', end: '' })
    onFiltersChange({})
  }

  const hasActiveFilters = !!(
    filters.status ||
    filters.tagIds?.length ||
    filters.search ||
    filters.dateFilter
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sortBy || 'createdAt'} onValueChange={handleSortChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sortOrder || 'desc'} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">↑ Asc</SelectItem>
            <SelectItem value="desc">↓ Desc</SelectItem>
          </SelectContent>
        </Select>

        {/* Tag Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <TagIcon className="h-4 w-4" />
              Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Filter by Tags</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTags.some(selectedTag => selectedTag.id === tag.id)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <TagBadge tag={tag} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        {tag.taskCount} tasks
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date
              {filters.dateFilter && filters.dateFilter !== 'all' && (
                <Badge variant="secondary" className="ml-1">
                  {filters.dateFilter}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Filter by Date</h4>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Dates' },
                  { value: 'today', label: 'Due Today' },
                  { value: 'upcoming', label: 'Next 7 Days' },
                  { value: 'overdue', label: 'Overdue' },
                  { value: 'custom', label: 'Custom Range' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`date-${option.value}`}
                      name="dateFilter"
                      value={option.value}
                      checked={filters.dateFilter === option.value}
                      onChange={(e) => handleDateFilterChange(e.target.value)}
                      className="rounded"
                    />
                    <label htmlFor={`date-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>

              {filters.dateFilter === 'custom' && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCustomDateChange} size="sm" className="w-full">
                    Apply Date Range
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearAllFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status && filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status.replace('_', ' ')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleStatusChange('all')}
              />
            </Badge>
          )}

          {selectedTags.map(tag => (
            <Badge key={tag.id} variant="secondary" className="gap-1">
              <TagBadge tag={tag} size="sm" />
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}

          {filters.dateFilter && filters.dateFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Date: {filters.dateFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleDateFilterChange('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}