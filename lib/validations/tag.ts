import { z } from 'zod'

export const createTagSchema = z.object({
  name: z.string()
    .min(1, 'Tag name is required')
    .max(30, 'Tag name must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Tag name can only contain letters, numbers, hyphens, and underscores')
    .refine(name => !name.startsWith(' ') && !name.endsWith(' '), 'Tag name cannot start or end with spaces'),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .optional(),
})

export const updateTagSchema = createTagSchema.partial()

export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof updateTagSchema>