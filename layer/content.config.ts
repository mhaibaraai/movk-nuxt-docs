import type { DefinedCollection } from '@nuxt/content'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'
import { joinURL } from 'ufo'
import { z } from 'zod'
import { docsFolderExists, landingPageExists } from './utils/pages'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')

const hasLandingPage = landingPageExists(options.rootDir)
const hasDocsFolder = docsFolderExists(options.rootDir)

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

const collections: Record<string, DefinedCollection> = {
  docs: defineCollection({
    type: 'page',
    source: {
      cwd,
      include: hasDocsFolder ? 'docs/**' : '**',
      prefix: hasDocsFolder ? '/docs' : '/',
      exclude: ['index.md']
    },
    schema: z.object({
      links: z.array(Button),
      category: z.string().optional(),
      navigation: z.object({
        title: z.string().optional()
      })
    })
  }),
  releases: defineCollection({
    type: 'page',
    source: {
      cwd,
      include: 'releases.{md,yml}'
    },
    schema: z.object({
      title: z.string(),
      description: z.string(),
      releases: z.string().optional(),
      hero: PageHero.optional()
    })
  })
}

if (!hasLandingPage) {
  collections.landing = defineCollection({
    type: 'page',
    source: {
      cwd,
      include: 'index.md'
    }
  })
}

export default defineContentConfig({ collections })
