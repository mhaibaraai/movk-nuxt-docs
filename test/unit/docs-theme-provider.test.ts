import type { NuxtApp } from 'nuxt/app'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { DocsTheme } from '../../layer/app/types/theme'

function themeProvider(primary: string): DocsTheme {
  return { primary: { value: primary } } as DocsTheme
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('docs theme provider', () => {
  it('returns the provider without initializing the built-in theme', async () => {
    const provider = themeProvider('blue')
    const useAppConfig = vi.fn(() => {
      throw new Error('built-in theme must not initialize')
    })
    vi.stubGlobal('useNuxtApp', () => ({ $docsTheme: provider }))
    vi.stubGlobal('useAppConfig', useAppConfig)

    const { useDocsTheme } = await import('../../layer/app/composables/useDocsTheme')
    expect(useDocsTheme()).toBe(provider)
    expect(useAppConfig).not.toHaveBeenCalled()
  })

  it('reads the current Nuxt app instead of retaining a provider across SSR requests', async () => {
    const first = themeProvider('blue')
    const second = themeProvider('red')
    let app = { $docsTheme: first }
    vi.stubGlobal('useNuxtApp', () => app)

    const { useDocsTheme } = await import('../../layer/app/composables/useDocsTheme')
    expect(useDocsTheme()).toBe(first)
    app = { $docsTheme: second }
    expect(useDocsTheme()).toBe(second)
    expect(first.primary.value).toBe('blue')
  })

  it('skips the Layer plugin before defaults, storage or head effects when a provider exists', async () => {
    const useAppConfig = vi.fn(() => {
      throw new Error('Layer theme effects must not run')
    })
    const useHead = vi.fn()
    vi.stubGlobal('defineNuxtPlugin', (plugin: unknown) => plugin)
    vi.stubGlobal('useAppConfig', useAppConfig)
    vi.stubGlobal('useHead', useHead)

    const { default: plugin } = await import('../../layer/app/plugins/theme')
    await plugin.setup!({ $docsTheme: themeProvider('blue') } as NuxtApp)
    expect(useAppConfig).not.toHaveBeenCalled()
    expect(useHead).not.toHaveBeenCalled()
  })
})
