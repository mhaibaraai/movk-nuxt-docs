import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'
import { asSeoCollection } from '@nuxtjs/seo/content'
import { joinURL } from 'ufo'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')

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

export default defineContentConfig({
  collections: {
    landing: defineCollection(asSeoCollection({
      type: 'page',
      source: {
        cwd,
        include: 'index.md'
      }
    })),
    docs: defineCollection(asSeoCollection({
      type: 'page',
      source: [{
        cwd,
        include: 'docs/**/*'
      }],
      schema: z.object({
        links: z.array(Button),
        category: z.string().optional(),
        navigation: z.object({
          title: z.string().optional()
        })
      })
    }))
  }
})
