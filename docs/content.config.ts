import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'
import { z } from 'zod/v4'

const Avatar = z.object({
  src: z.string(),
  alt: z.string().optional()
})

const Button = z.object({
  label: z.string(),
  icon: z.string().optional(),
  avatar: Avatar.optional(),
  leadingIcon: z.string().optional(),
  trailingIcon: z.string().optional(),
  to: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  id: z.string().optional(),
  class: z.string().optional()
})

const PageHero = z.object({
  title: z.string(),
  description: z.string(),
  links: z.array(Button).optional()
})

export default defineContentConfig({
  collections: {
    releases: defineCollection(asSeoCollection({
      type: 'page',
      source: 'releases.yml',
      schema: z.object({
        releases: z.string(),
        hero: PageHero
      })
    }))
  }
})
