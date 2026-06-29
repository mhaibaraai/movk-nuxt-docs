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

const releasesSchema = z.object({
  title: z.string(),
  description: z.string(),
  releases: z.string().optional(),
  hero: PageHero.optional()
})

const templatesSchema = z.object({
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

function defineReleasesCollection(code: string | null): DefinedCollection {
  return defineCollection({
    type: 'page',
    source: {
      cwd,
      include: code ? `${code}/releases.{md,yml}` : 'releases.{md,yml}'
    },
    schema: releasesSchema
  })
}

function defineTemplatesCollection(code: string | null): DefinedCollection {
  return defineCollection({
    type: 'page',
    source: {
      cwd,
      include: code ? `${code}/templates.{md,yml}` : 'templates.{md,yml}'
    },
    schema: templatesSchema
  })
}

const collections: Record<string, DefinedCollection> = {}

if (Array.isArray(locales) && locales.length) {
  for (const locale of locales) {
    const code = localeCode(locale)
    const isDefault = code === defaultLocale
    const localeArg = isDefault ? null : code

    collections[collectionName('docs', code, defaultLocale)] = defineDocsCollection(localeArg)
    collections[collectionName('releases', code, defaultLocale)] = defineReleasesCollection(localeArg)
    collections[collectionName('templates', code, defaultLocale)] = defineTemplatesCollection(localeArg)

    if (!hasLandingPage) {
      collections[collectionName('landing', code, defaultLocale)] = defineLandingCollection(localeArg)
    }
  }
} else {
  collections.docs = defineDocsCollection(null)
  collections.releases = defineReleasesCollection(null)
  collections.templates = defineTemplatesCollection(null)

  if (!hasLandingPage) {
    collections.landing = defineLandingCollection(null)
  }
}

export default defineContentConfig({ collections })
