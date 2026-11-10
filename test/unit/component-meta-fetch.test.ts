import { afterEach, describe, expect, it, vi } from 'vitest'

const context = vi.hoisted(() => ({
  headers: new Map<string, string>(),
  fetch: vi.fn()
}))

vi.mock('#imports', () => ({
  useRequestEvent: () => ({ node: { res: {
    getHeader: (key: string) => context.headers.get(key),
    setHeader: (key: string, value: string) => context.headers.set(key, value)
  } } }),
  useAsyncData: (_key: string, handler: () => Promise<unknown>) => handler()
}))

afterEach(() => {
  context.headers.clear()
  context.fetch.mockReset()
  vi.unstubAllGlobals()
})

describe('component metadata prerender hints', () => {
  it('advertises existing metadata and preserves hints already added by other components', async () => {
    context.headers.set('x-nitro-prerender', '/existing.json')
    context.fetch.mockResolvedValue({ meta: { props: [] } })
    vi.stubGlobal('$fetch', context.fetch)
    const { useFetchComponentMeta } = await import('../../layer/modules/component-docs/runtime/composables/useFetchComponentMeta')

    expect(await useFetchComponentMeta('TestApi')).toEqual({ meta: { props: [] } })
    expect(context.headers.get('x-nitro-prerender')).toBe('/existing.json,/api/component-meta/TestApi.json')
  })

  it('keeps unexpected metadata failures visible to prerender validation', async () => {
    context.fetch.mockRejectedValue(Object.assign(new Error('Metadata failed'), { statusCode: 500 }))
    vi.stubGlobal('$fetch', context.fetch)
    const { useFetchComponentMeta } = await import('../../layer/modules/component-docs/runtime/composables/useFetchComponentMeta')

    expect(await useFetchComponentMeta('TestApi')).toEqual({})
    expect(context.headers.get('x-nitro-prerender')).toBe('/api/component-meta/TestApi.json')
  })

  it('allows examples without generated metadata without advertising a missing route', async () => {
    context.fetch.mockRejectedValue(Object.assign(new Error('Components not found!'), { statusCode: 404 }))
    vi.stubGlobal('$fetch', context.fetch)
    const { useFetchComponentMeta } = await import('../../layer/modules/component-docs/runtime/composables/useFetchComponentMeta')

    expect(await useFetchComponentMeta('UBadge')).toEqual({})
    expect(context.headers.has('x-nitro-prerender')).toBe(false)
  })
})
