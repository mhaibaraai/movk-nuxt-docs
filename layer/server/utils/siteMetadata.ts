import type { Collections } from '@nuxt/content'
import type { H3Event } from 'h3'
import { getRequestURL } from 'h3'
import { joinURL } from 'ufo'
import collections from '#content/manifest'

interface PageMetadata {
  title?: string
  description?: string
}

interface GithubConfig {
  url?: string
}

interface SeoConfig {
  title?: string
  description?: string
}

interface RuntimeConfigWithAiChat {
  aiChat?: {
    mcpPath?: string
  }
}

function withoutTrailingSlash(value: string) {
  return value.replace(/\/$/, '')
}

export function getPageCollections(excluded: Array<keyof Collections> = []) {
  return Object.entries(collections as unknown as Record<string, { type: string }>)
    .filter(([key, value]) => value.type === 'page' && !excluded.includes(key as keyof Collections))
    .map(([key]) => key as keyof Collections)
}

export function getSiteBaseURL(event: H3Event) {
  const siteUrl = withoutTrailingSlash(getSiteConfig(event).url || getRequestURL(event).origin)
  const baseURL = withoutTrailingSlash(useRuntimeConfig(event).app.baseURL)

  return {
    siteUrl,
    baseURL,
    baseSiteUrl: joinURL(siteUrl, baseURL || '/')
  }
}

export function createSiteURL(event: H3Event, path = '/') {
  const { baseSiteUrl } = getSiteBaseURL(event)
  return joinURL(baseSiteUrl, path)
}

export function getSiteMetadata(event: H3Event, page?: PageMetadata | null) {
  const runtimeConfig = useRuntimeConfig(event)
  const appConfig = useAppConfig()
  const siteConfig = getSiteConfig(event)
  const { siteUrl, baseURL, baseSiteUrl } = getSiteBaseURL(event)
  const seo = (appConfig.seo || {}) as SeoConfig
  const github = appConfig.github as GithubConfig | false | undefined
  const siteName = siteConfig.name || seo.title || page?.title || 'Documentation'
  const description = seo.description || page?.description || ''
  const mcpPath = (runtimeConfig as RuntimeConfigWithAiChat).aiChat?.mcpPath || '/mcp'
  const mcpUrl = mcpPath.startsWith('http://') || mcpPath.startsWith('https://')
    ? mcpPath
    : createSiteURL(event, mcpPath)

  return {
    siteUrl,
    baseURL,
    baseSiteUrl,
    siteName,
    description,
    repository: github ? github.url : undefined,
    version: runtimeConfig.public.version,
    mcpPath,
    mcpUrl
  }
}
