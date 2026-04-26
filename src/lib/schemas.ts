import { z } from 'zod'

const SOURCE_NAMES = ['Autohome', 'Ifeng', 'Sina', 'PCauto'] as const

export const articleFrontmatterSchema = z.object({
  title: z.string().min(1, 'title is required'),
  date: z.union([z.string().datetime(), z.date()]).transform((v) =>
    v instanceof Date ? v.toISOString() : v
  ),
  description: z.string().min(1, 'description is required'),
  source: z.enum(SOURCE_NAMES),
  image: z.string().url().optional(),
  category: z.enum(['news', 'weekly']).default('news'),
  brand: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  original_url: z.string().url({ message: 'original_url must be a valid URL' }),
  read_time_minutes: z.number().int().min(1).optional(),
})

export type ValidatedFrontmatter = z.infer<typeof articleFrontmatterSchema>
