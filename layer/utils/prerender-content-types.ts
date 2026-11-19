import { readFile, unlink, writeFile } from 'node:fs/promises'
import type { NuxtHooks } from 'nuxt/schema'
import { extname, join, relative } from 'pathe'
import { encodePath, joinURL, withLeadingSlash, withoutLeadingSlash, withoutTrailingSlash } from 'ufo'

type Nitro = Parameters<NuxtHooks['nitro:init']>[0]

interface PrerenderedRoute {
  route: string
  fileName?: string
  contentType?: string
}

interface DocumentHeader {
  fileName: string
  path: string
  pattern: string
  contentType: string
}

interface HeaderBlock {
  path?: string
  text: string
  matcher?: RegExp
  setsContentType: boolean
  removesContentType: boolean
}

type VercelOverrides = Record<string, { path?: string, contentType?: string }>

const DIRECT_DOCUMENTS = new Set([
  '/llms.txt',
  '/llms-full.txt',
  '/sitemap.md',
  '/.well-known/api-catalog',
  '/.well-known/mcp/server-card.json',
  '/.well-known/skills/index.json'
])
const SKILLS_PREFIX = '/.well-known/skills/'
const CONTENT_TYPE = /^[\t ]+content-type[\t ]*:/im
const UNSET_CONTENT_TYPE = /^[\t ]+![\t ]+content-type[\t ]*$/im
const HEADER_PATH = /^(?:\/|https:\/\/)/i
const CLOUDFLARE_ASSETS = /^cloudflare-(?:module|durable|pages(?:-static)?)$/

export function getPrerenderedDocumentHeaders(routes: PrerenderedRoute[], rawPrefix: string, baseURL: string): DocumentHeader[] {
  const rawDir = `${withoutTrailingSlash(withLeadingSlash(rawPrefix))}/`
  const headerPath = (path: string) => encodePath(joinURL(baseURL, path)).replace(/\*/g, '%2A').replace(/:/g, '%3A')

  return routes.flatMap(({ route, fileName, contentType }) => {
    if (!fileName || !contentType) return []

    const path = headerPath(fileName)
    const extension = extname(fileName)
    if (DIRECT_DOCUMENTS.has(route)) return [{ fileName, path, pattern: path, contentType }]

    // Only aggregate assets in the module's reserved directories.
    const directory = route.startsWith(rawDir) && route.endsWith('.md') && fileName.startsWith(rawDir) && extension === '.md'
      ? rawDir
      : route.startsWith(SKILLS_PREFIX) && fileName.startsWith(SKILLS_PREFIX) ? SKILLS_PREFIX : undefined
    if (!directory) return []

    // The skill name segment keeps these rules separate from the top-level index.
    const scope = directory === SKILLS_PREFIX ? `${headerPath(directory)}:skill/` : headerPath(directory)
    const pattern = /^\.[\da-z]+$/i.test(extension) ? `${scope}*${extension}` : path
    return [{ fileName, path, pattern, contentType }]
  })
}

function parseHeaderBlocks(source: string): HeaderBlock[] {
  return source.split(/(?=^[\t ]*(?:\/|https:\/\/))/im).map((text) => {
    const firstLine = text.split('\n', 1)[0]?.trim() || ''
    if (!HEADER_PATH.test(firstLine)) return { text, setsContentType: false, removesContentType: false }

    // A host-qualified rule still needs to override the generated path rule when its host matches.
    const pathname = firstLine.replace(/^https:\/\/[^/]+/i, '') || '/'
    const regex = pathname.split(/(\*|:[a-z]\w*)/i).map((segment) => {
      if (segment === '*') return '.*'
      if (segment.startsWith(':')) return '[^/]+'
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }).join('')
    return {
      path: firstLine,
      text,
      matcher: new RegExp(`^${regex}$`),
      setsContentType: CONTENT_TYPE.test(text),
      removesContentType: UNSET_CONTENT_TYPE.test(text)
    }
  })
}

export function mergeContentTypeHeaders(source: string, documents: DocumentHeader[], cloudflare: boolean): string {
  const blocks = parseHeaderBlocks(source)
  const explicit = blocks.filter(block => block.setsContentType || block.removesContentType)
  const exact = new Map(blocks.map(block => [block.path, block]))
  const additions = new Map<string, string>()
  const detach = new Set<HeaderBlock>()

  for (const [pattern, files] of Object.entries(Object.groupBy(documents, document => document.pattern))) {
    const matches = files!.map(file => ({ file, overrides: explicit.filter(block => block.matcher?.test(file.path)) }))
    const missing = matches.filter(({ overrides }) => overrides.length === 0)
    const contentType = missing[0]?.file.contentType
    if (!contentType) continue

    const sameType = matches.every(({ file }) => file.contentType === contentType)
    const allMissing = missing.length === matches.length
    if (sameType && (allMissing || (cloudflare && !exact.has(pattern)))) {
      additions.set(pattern, contentType)
      // Cloudflare joins matching values unless the authored rule detaches the generated default.
      for (const { overrides } of matches) {
        for (const block of overrides) {
          if (block.setsContentType && !block.removesContentType) detach.add(block)
        }
      }
    } else {
      for (const { file } of missing) additions.set(file.path, file.contentType)
    }
  }

  const generated: string[] = []
  for (const [path, contentType] of additions) {
    const header = `  content-type: ${contentType}`
    const block = exact.get(path)
    if (block) block.text = `${block.text.trimEnd()}\n${header}\n`
    else generated.push(`${path}\n${header}\n`)
  }
  for (const block of detach) {
    block.text = block.text.replace(CONTENT_TYPE, match => `  ! Content-Type\n${match}`)
  }
  return generated.join('') + blocks.map(block => block.text).join('')
}

export function applyVercelContentTypes(overrides: VercelOverrides, documents: DocumentHeader[], assetDir: string, baseURL = '/', configured?: VercelOverrides): VercelOverrides {
  const updated = new Map(Object.entries(overrides))
  for (const { fileName, contentType } of documents) {
    const localFile = withoutLeadingSlash(fileName)
    const deployedFile = join(assetDir, localFile)
    const existing = updated.get(deployedFile)
    const previous = updated.get(localFile)
    if (deployedFile !== localFile && previous && !configured?.[localFile]) {
      // Nitro 2 can emit an override relative to publicDir instead of the Vercel static root.
      const { path, ...metadata } = previous
      const moved = path === undefined ? metadata : { ...metadata, path: withoutLeadingSlash(joinURL(baseURL, path)) }
      updated.set(deployedFile, { ...moved, ...existing })
      updated.delete(localFile)
    }
    const override = updated.get(deployedFile)
    updated.set(deployedFile, { ...override, contentType: override?.contentType ?? contentType })
  }
  return Object.fromEntries(updated)
}

async function readOptional(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
}

export function setupPrerenderContentTypes(nitro: Nitro): void {
  const { preset, baseURL, output } = nitro.options
  const cloudflare = CLOUDFLARE_ASSETS.test(preset)
  const netlify = /^netlify(?:-|$)/.test(preset)
  const vercel = /^vercel(?:-|$)/.test(preset)
  if (!cloudflare && !netlify && !vercel) return

  const discovery = nitro.options.runtimeConfig.agentDiscovery as { rawPrefix?: string } | undefined
  let documents: DocumentHeader[] = []
  nitro.hooks.hook('prerender:done', ({ prerenderedRoutes }) => {
    documents = getPrerenderedDocumentHeaders(prerenderedRoutes, discovery?.rawPrefix || '/raw', baseURL)
  })
  nitro.hooks.hook('compiled', async () => {
    if (!documents.length) return

    if (vercel) {
      const configPath = join(output.dir, 'config.json')
      const config = JSON.parse(await readFile(configPath, 'utf8')) as { overrides?: VercelOverrides }
      config.overrides = applyVercelContentTypes(config.overrides || {}, documents, relative(join(output.dir, 'static'), output.publicDir), baseURL, nitro.options.vercel?.config?.overrides)
      await writeFile(configPath, JSON.stringify(config, null, 2))
      return
    }

    const base = withoutTrailingSlash(baseURL)
    const publicDir = withoutTrailingSlash(output.publicDir)
    const assetRoot = preset.startsWith('cloudflare-pages')
      ? output.dir
      : base && publicDir.endsWith(base) ? publicDir.slice(0, -base.length) : publicDir
    const target = join(assetRoot, '_headers')
    const copied = join(publicDir, '_headers')
    const original = await readOptional(target)
    const nested = target === copied ? undefined : await readOptional(copied)
    const source = [original, nested].filter(part => part !== undefined).join('\n')
    const headers = mergeContentTypeHeaders(source, documents, cloudflare)
    await writeFile(target, headers)
    if (nested !== undefined) await unlink(copied)
  })
}
