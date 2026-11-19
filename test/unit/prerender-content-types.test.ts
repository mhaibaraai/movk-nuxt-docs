import { describe, expect, it } from 'vitest'
import { applyVercelContentTypes, getPrerenderedDocumentHeaders, mergeContentTypeHeaders } from '../../layer/utils/prerender-content-types'

const markdown = 'text/markdown; charset=utf-8'
const plainText = 'text/plain; charset=utf-8'

const documents = getPrerenderedDocumentHeaders([
  { route: '/llms.txt', fileName: '/llms.txt', contentType: plainText },
  { route: '/markdown/docs/intro.md', fileName: '/markdown/docs/intro.md', contentType: markdown },
  { route: '/markdown/docs/custom.md', fileName: '/markdown/docs/custom.md', contentType: markdown },
  { route: '/.well-known/skills/writing/SKILL.md', fileName: '/.well-known/skills/writing/SKILL.md', contentType: markdown },
  { route: '/sitemap.md', fileName: '/sitemap.md', contentType: markdown },
  { route: '/outside.md', fileName: '/outside.md', contentType: markdown },
  { route: '/llms-full.txt', contentType: plainText }
], '/markdown', '/guide/')

describe('prerendered document Content-Type', () => {
  it('limits rules to files the Layer serves and includes the deployment base', () => {
    expect(mergeContentTypeHeaders('', documents, true)).toContain('/guide/markdown/*.md\n  content-type: text/markdown; charset=utf-8')
    expect(documents.map(document => document.path)).toEqual([
      '/guide/llms.txt',
      '/guide/markdown/docs/intro.md',
      '/guide/markdown/docs/custom.md',
      '/guide/.well-known/skills/writing/SKILL.md',
      '/guide/sitemap.md'
    ])
  })

  it('preserves authored headers at the same path and puts Cloudflare overrides after the default', () => {
    const source = '/guide/llms.txt\n  Cache-Control: private\n/guide/markdown/docs/custom.md\n  Content-Type: text/plain\n  X-Robots-Tag: noindex\n'
    const result = mergeContentTypeHeaders(source, documents, true)

    expect(result.match(/^\/guide\/llms\.txt$/gm)).toHaveLength(1)
    expect(result).toContain('/guide/llms.txt\n  Cache-Control: private\n  content-type: text/plain; charset=utf-8')
    expect(result).toContain('/guide/markdown/docs/custom.md\n  ! Content-Type\n  Content-Type: text/plain\n  X-Robots-Tag: noindex')
    expect(result.indexOf('/guide/markdown/*.md')).toBeLessThan(result.indexOf('/guide/markdown/docs/custom.md'))
  })

  it('does not put a generated Cloudflare default after an authored override', () => {
    const source = '/guide/markdown/docs/custom.md\n  Content-Type: text/plain\n/guide/markdown/*.md\n  X-Robots-Tag: noindex\n'
    const result = mergeContentTypeHeaders(source, documents, true)

    expect(result).toContain('/guide/markdown/docs/intro.md\n  content-type: text/markdown; charset=utf-8')
    expect(result).toContain(source)
  })

  it('keeps JSON skill files separate from the discovery index', () => {
    const json = 'application/json; charset=utf-8'
    const files = getPrerenderedDocumentHeaders([
      { route: '/.well-known/skills/writing/assets/example.json', fileName: '/.well-known/skills/writing/assets/example.json', contentType: json },
      { route: '/.well-known/skills/index.json', fileName: '/.well-known/skills/index.json', contentType: json }
    ], '/raw', '/')

    expect(files.map(file => file.pattern)).toEqual([
      '/.well-known/skills/:skill/*.json',
      '/.well-known/skills/index.json'
    ])
  })

  it('uses exact Netlify rules around authored Content-Type values', () => {
    const source = '/guide/markdown/docs/custom.md\n  Content-Type: text/plain\n'
    const result = mergeContentTypeHeaders(source, documents, false)

    expect(result).not.toContain('/guide/markdown/*.md')
    expect(result).toContain('/guide/markdown/docs/intro.md\n  content-type: text/markdown; charset=utf-8')
    expect(result).toContain(source)
  })

  it('sets Vercel overrides on deployed files and keeps configured values', () => {
    const overrides = { 'guide/llms.txt': { contentType: 'text/plain' } }
    expect(applyVercelContentTypes(overrides, documents, 'guide')).toMatchObject({
      'guide/llms.txt': { contentType: 'text/plain' },
      'guide/markdown/docs/intro.md': { contentType: markdown },
      'guide/sitemap.md': { contentType: markdown }
    })
  })

  it('moves Nitro’s unprefixed Vercel metadata and keeps explicit root overrides', () => {
    const overrides = {
      'llms.txt': { path: 'documents/llms.txt' },
      'sitemap.md': { contentType: 'text/plain' }
    }

    const result = applyVercelContentTypes(overrides, documents, 'guide', '/guide/', { 'sitemap.md': overrides['sitemap.md'] })

    expect(result['guide/llms.txt']).toEqual({ path: 'guide/documents/llms.txt', contentType: plainText })
    expect(result).not.toHaveProperty(['llms.txt'])
    expect(result['sitemap.md']).toEqual(overrides['sitemap.md'])
    expect(result['guide/sitemap.md']).toEqual({ contentType: markdown })
  })
})
