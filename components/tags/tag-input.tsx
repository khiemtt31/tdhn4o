'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TagBadge } from './tag-badge'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Tag } from '@/types/task'

interface TagInputProps {
  selectedTagIds: string[]
  onTagsChange: (tagIds: string[]) => void
  placeholder?: string
  maxTags?: number
}

export function TagInput({ selectedTagIds, onTagsChange, placeholder = "Add tags...", maxTags }: TagInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch tags
  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: QUERY_KEYS.tags,
    queryFn: async (): Promise<Tag[]> => {
      const response = await fetch('/api/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      return response.json()
    },
  })

  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id))
  const availableTags = tags.filter(tag => !selectedTagIds.includes(tag.id))

  // Filter tags based on input
  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleSelectTag = (tag: Tag) => {
    if (maxTags && selectedTagIds.length >= maxTags) return

    const newSelectedIds = [...selectedTagIds, tag.id]
    onTagsChange(newSelectedIds)
    setInputValue('')
    setOpen(false)
  }

  const handleCreateTag = async () => {
    if (!inputValue.trim()) return

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: inputValue.trim() }),
      })

      if (response.ok) {
        const newTag = await response.json()
        const newSelectedIds = [...selectedTagIds, newTag.id]
        onTagsChange(newSelectedIds)
        setInputValue('')
        setOpen(false)
      } else if (response.status === 409) {
        // Tag already exists, use the existing one
        const data = await response.json()
        const existingTag = data.existingTag
        if (existingTag && !selectedTagIds.includes(existingTag.id)) {
          const newSelectedIds = [...selectedTagIds, existingTag.id]
          onTagsChange(newSelectedIds)
        }
        setInputValue('')
        setOpen(false)
      }
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  const handleRemoveTag = (tagId: string) => {
    const newSelectedIds = selectedTagIds.filter(id => id !== tagId)
    onTagsChange(newSelectedIds)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      handleCreateTag()
    } else if (e.key === 'Backspace' && !inputValue && selectedTagIds.length > 0) {
      // Remove last selected tag
      const newSelectedIds = selectedTagIds.slice(0, -1)
      onTagsChange(newSelectedIds)
    }
  }

  return (
    <div className="space-y-2">
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              showRemove
              onRemove={() => handleRemoveTag(tag.id)}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* Tag input */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={maxTags ? selectedTagIds.length >= maxTags : false}
          >
            <span className="truncate">
              {inputValue || placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search tags or type to create..."
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue.trim() ? (
                  <div className="p-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      No tags found. Press Enter to create &quot;{inputValue}&quot;
                    </p>
                    <Button
                      size="sm"
                      onClick={handleCreateTag}
                      className="w-full"
                    >
                      Create &quot;{inputValue}&quot;
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2">
                    Start typing to search or create tags
                  </p>
                )}
              </CommandEmpty>
              {filteredTags.length > 0 && (
                <CommandGroup heading="Existing Tags">
                  {filteredTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => handleSelectTag(tag)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <TagBadge tag={tag} size="sm" />
                        {tag.taskCount !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            {tag.taskCount} tasks
                          </span>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTagIds.includes(tag.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}