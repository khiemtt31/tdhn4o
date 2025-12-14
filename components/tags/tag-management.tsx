'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit, Trash2, Plus, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TagBadge } from './tag-badge'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Tag } from '@/types/task'

interface TagManagementProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TagManagement({ open, onOpenChange }: TagManagementProps) {
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('')
  const queryClient = useQueryClient()

  // Fetch tags
  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: QUERY_KEYS.tags,
    queryFn: async (): Promise<Tag[]> => {
      const response = await fetch('/api/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      return response.json()
    },
    enabled: open,
  })

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: async (data: { name: string; color?: string }) => {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create tag')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags })
      setNewTagName('')
      setNewTagColor('')
    },
  })

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; color?: string } }) => {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update tag')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags })
      setEditingTag(null)
    },
  })

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete tag')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags })
      setDeletingTag(null)
    },
  })

  const handleCreateTag = () => {
    if (!newTagName.trim()) return
    createTagMutation.mutate({
      name: newTagName.trim(),
      color: newTagColor || undefined,
    })
  }

  const handleUpdateTag = () => {
    if (!editingTag) return
    updateTagMutation.mutate({
      id: editingTag.id,
      data: {
        name: editingTag.name,
        color: editingTag.color,
      },
    })
  }

  const handleDeleteTag = () => {
    if (!deletingTag) return
    deleteTagMutation.mutate(deletingTag.id)
  }

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16',
    '#EC4899', '#6B7280', '#6366F1', '#14B8A6'
  ]

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">Loading tags...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Create new tag */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Create New Tag</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                  />
                </div>
                <Input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-16"
                />
                <Button
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || createTagMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Existing tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Your Tags ({tags.length})
              </h3>
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tags created yet. Create your first tag above.
                </p>
              ) : (
                <div className="grid gap-3">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <TagBadge tag={tag} />
                        <span className="text-sm text-muted-foreground">
                          {tag.taskCount} {tag.taskCount === 1 ? 'task' : 'tasks'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTag(tag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingTag(tag)}
                          disabled={tag.taskCount > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit tag dialog */}
      {editingTag && (
        <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        editingTag.color === color ? 'border-foreground' : 'border-muted'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingTag({ ...editingTag, color })}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={editingTag.color || '#3B82F6'}
                  onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTag(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTag}
                disabled={updateTagMutation.isPending}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation */}
      {deletingTag && (
        <AlertDialog open={!!deletingTag} onOpenChange={() => setDeletingTag(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Tag</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the tag &quot;{deletingTag.name}&quot;?
                {deletingTag.taskCount > 0 && (
                  <span className="block mt-2 text-destructive">
                    This tag is used in {deletingTag.taskCount} tasks. Deleting it will remove the tag from all associated tasks.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTag}
                disabled={deleteTagMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}