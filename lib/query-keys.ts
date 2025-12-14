// Query keys for React Query cache management
export const QUERY_KEYS = {
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  tasksFiltered: (filter: string) => ['tasks', filter] as const,
  tags: ['tags'] as const,
  tag: (id: string) => ['tags', id] as const,
} as const

// Helper function to invalidate all task-related queries
export const invalidateTasks = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks })
}

// Helper function to invalidate all tag-related queries
export const invalidateTags = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags })
}