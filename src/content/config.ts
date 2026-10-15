import { defineCollection, z } from 'astro:content'

const work = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number(),
    kicker: z.string(),
    title: z.string(),
    description: z.string(),
    story: z.string(),
    built: z.array(z.string()),
    metrics: z.array(
      z.object({
        value: z.string(),
        label: z.string()
      })
    ).length(3),
    stack: z.array(z.string()),
    quote: z
      .object({
        text: z.string(),
        author: z.string()
      })
      .optional()
  })
})

export const collections = { work }
