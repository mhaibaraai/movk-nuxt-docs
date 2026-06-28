import type { DefinedCollection } from '@nuxt/content'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'
import { joinURL } from 'ufo'
import { z } from 'zod'
import { collectionName, localeCode } from './utils/locale'
import { docsFolderExists, landingPageExists } from './utils/pages'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')

const i18n = (options as typeof options & { i18n?: { locales?: Array<string | { code: string }>, defaultLocale?: string } }).i18n
const locales = i18n?.locales
const defaultLocale = i18n?.defaultLocale

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

const docsSchema = z.object({
  index: z.boolean().optional(),
  links: z.array(Button),
  category: z.string().optional(),
  navigation: z.object({
    title: z.string().optional(),
    badge: z.string().optional()
  })
})

function defineDocsCollection(code: string | null): DefinedCollection {
  if (!code) {
    return defineCollection({
      type: 'page',
      source: {
        cwd,
        include: hasDocsFolder ? 'docs/**' : '**',
        prefix: hasDocsFolder ? '/docs' : '/',
        exclude: ['index.md']
      },
      schema: docsSchema
    })
  }

  const hasLocaleDocs = docsFolderExists(options.rootDir, code)
  return defineCollection({
    type: 'page',
    source: {
      cwd,
      include: hasLocaleDocs ? `${code}/docs/**` : `${code}/**/*`,
      prefix: hasLocaleDocs ? `/${code}/docs` : `/${code}`,
      exclude: [`${code}/index.md`]
    },
    schema: docsSchema
  })
}

function defineLandingCollection(code: string | null): DefinedCollection {
  return defineCollection({
    type: 'page',
    source: {
      cwd,
      include: code ? `${code}/index.md` : 'index.md'
    }
  })
}

const collections: Record<string, DefinedCollection> = {}

if (Array.isArray(locales) && locales.length) {
  for (const locale of locales) {
    const code = localeCode(locale)
    const isDefault = code === defaultLocale

    collections[collectionName('docs', code, defaultLocale)] = defineDocsCollection(isDefault ? null : code)

    if (!hasLandingPage) {
      collections[collectionName('landing', code, defaultLocale)] = defineLandingCollection(isDefault ? null : code)
    }
  }
} else {
  collections.docs = defineDocsCollection(null)

  if (!hasLandingPage) {
    collections.landing = defineLandingCollection(null)
  }
}

collections.releases = defineCollection({
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

collections.templates = defineCollection({
  type: 'page',
  source: {
    cwd,
    include: 'templates.{md,yml}'
  },
  schema: z.object({
    title: z.string(),
    description: z.string(),
    hero: PageHero.optional(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string(),
      features: z.array(z.object({
        title: z.string(),
        icon: z.string().optional()
      })).optional(),
      links: z.array(Button).optional()
    }))
  })
})

export default defineContentConfig({ collections })
