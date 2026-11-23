import type { NuxtConfig } from 'nuxt/schema'
import { fileURLToPath } from 'node:url'
import { loadNuxt } from 'nuxt'
import { describe, expect, it } from 'vitest'

const cwd = fileURLToPath(new URL('../../layer', import.meta.url))

async function readFontOptions(overrides: NuxtConfig = {}) {
  const nuxt = await loadNuxt({ cwd, dotenv: false, ready: false, overrides: { debug: false, ...overrides } })

  try {
    if (nuxt.options.hooks) nuxt.addHooks(nuxt.options.hooks)
    await nuxt.callHook('modules:before')
    return { uiFonts: nuxt.options.ui?.fonts, fonts: nuxt.options.fonts }
  } finally {
    await nuxt.close()
  }
}

describe('OG image font configuration', () => {
  it('configures the local font before modules resolve dependencies', async () => {
    expect(await readFontOptions()).toMatchObject({
      uiFonts: true,
      fonts: {
        devtools: false,
        processCSSVariables: false,
        families: [{ name: 'Noto Sans SC Variable', provider: 'npm' }]
      }
    })
  })

  it('respects explicit consumer font settings', async () => {
    expect(await readFontOptions({ ui: { fonts: false } })).toEqual({
      uiFonts: false,
      fonts: undefined
    })
    expect(await readFontOptions({ fonts: { devtools: true } })).toMatchObject({
      uiFonts: true,
      fonts: {
        devtools: true,
        families: [{ name: 'Noto Sans SC Variable', provider: 'npm' }]
      }
    })
  })
})
