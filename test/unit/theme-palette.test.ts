import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'
import { applyPaletteVars, createColorRestoreScript, parsePaletteVars, resolvePaletteVars, resolveThemeColor } from '../../layer/app/utils/theme-palette'

describe('theme palette', () => {
  it('restores valid palette variables and rejects unrelated storage values', () => {
    expect(parsePaletteVars(JSON.stringify({ '--ui-color-primary-500': 'red', '--ui-color-neutral-950': 'black', 'color': 'red' })))
      .toEqual({ '--ui-color-primary-500': 'red', '--ui-color-neutral-950': 'black' })
    expect(parsePaletteVars('{')).toEqual({})
  })

  it('restores saved colors before hydration', () => {
    const values: Record<string, string> = {}
    runInNewContext(createColorRestoreScript('docs'), {
      localStorage: { getItem: () => JSON.stringify({ '--ui-color-primary-500': 'red', 'color': 'blue' }) },
      document: { documentElement: { style: { setProperty: (key: string, value: string) => { values[key] = value } } } }
    })
    expect(values).toEqual({ '--ui-color-primary-500': 'red' })
  })

  it('uses custom palette variables and literal Tailwind values without neutral cycles', () => {
    expect(resolvePaletteVars({ primary: 'vermilion' })['--ui-color-primary-500']).toBe('var(--color-vermilion-500)')
    expect(resolvePaletteVars({ neutral: 'neutral' })['--ui-color-neutral-500']).not.toContain('var(')
    expect(resolvePaletteVars({ primary: 'unknown' })).toEqual({})
    expect(resolveThemeColor('paper', 'light')).toBe('#faf9f5')
    expect(resolveThemeColor('paper', 'dark')).toBe('#141413')
  })

  it('removes variables when returning to the stylesheet default', () => {
    const values = new Map([['--ui-color-primary-500', 'red']])
    applyPaletteVars({ style: {
      setProperty: (key, value) => { values.set(key, value) },
      removeProperty: (key) => {
        values.delete(key)
        return ''
      }
    } }, {}, Object.fromEntries(values))
    expect(values.size).toBe(0)
  })
})

describe('v5 theme integration', () => {
  it('works without removed ui.colors and exports palette choices as CSS', async () => {
    const ref = (value: unknown) => ({ value })
    const computed = (options: (() => unknown) | { get: () => unknown, set: (value: unknown) => void }) => ({
      get value() { return typeof options === 'function' ? options() : options.get() },
      set value(value) { if (typeof options !== 'function') options.set(value) }
    })
    const { vi } = await import('vitest')
    const state = new Map()
    vi.stubGlobal('computed', computed)
    vi.stubGlobal('useState', (key: string, init: () => unknown) => {
      if (!state.has(key)) state.set(key, ref(init()))
      return state.get(key)
    })
    vi.stubGlobal('useAppConfig', () => ({ ui: { icons: {} }, theme: {} }))
    vi.stubGlobal('useSiteConfig', () => ({ name: 'Docs' }))
    vi.stubGlobal('useColorMode', () => ({ value: 'light', preference: 'system' }))
    try {
      const { useTheme } = await import('../../layer/app/composables/useTheme')
      const theme = useTheme()
      expect(theme.hasConfigChanges.value).toBe(false)
      expect(theme.primary.value).toBe('vermilion')
      expect(theme.neutral.value).toBe('paper')
      theme.primary.value = 'blue'
      expect(theme.exportCSS()).toContain('@plugin "@nuxt/ui/colors"')
      expect(theme.exportCSS()).toContain('primary: blue;')
      expect(theme.hasCSSChanges.value).toBe(true)
      expect(theme.hasConfigChanges.value).toBe(false)
      expect(theme.exportConfig()).not.toContain('colors:')
      theme.primary.value = 'unknown'
      expect(theme.primary.value).toBe('blue')
      theme.resetTheme()
      expect(theme.primary.value).toBe('vermilion')
      expect(theme.neutral.value).toBe('paper')
      expect(theme.hasCSSChanges.value).toBe(false)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
