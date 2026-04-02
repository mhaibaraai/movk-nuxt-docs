import { themeIcons } from '../utils/theme'
import { omit, kebabCase } from '@movk/core'
import { useLocalStorage } from '@vueuse/core'
import colors from 'tailwindcss/colors'

export function useTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()
  const site = useSiteConfig()

  const radius = useLocalStorage(`${site.name}-ui-radius`, 0.25)
  const font = useLocalStorage(`${site.name}-ui-font`, 'Public Sans')
  const _iconSet = useLocalStorage(`${site.name}-ui-icons`, 'lucide')
  const blackAsPrimary = useLocalStorage(`${site.name}-ui-black-as-primary`, false)

  const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']
  const neutral = computed({
    get() {
      return appConfig.ui.colors.neutral
    },
    set(option) {
      appConfig.ui.colors.neutral = option
      window.localStorage.setItem(`${site.name}-ui-neutral`, appConfig.ui.colors.neutral)
    }
  })

  const colorsToOmit = ['inherit', 'current', 'transparent', 'black', 'white', ...neutralColors]
  const primaryColors = Object.keys(omit(colors, colorsToOmit as any))
  const primary = computed({
    get() {
      return appConfig.ui.colors.primary
    },
    set(option) {
      appConfig.ui.colors.primary = option
      window.localStorage.setItem(`${site.name}-ui-primary`, appConfig.ui.colors.primary)
      blackAsPrimary.value = false
    }
  })

  const radiuses = [0, 0.125, 0.25, 0.375, 0.5]
  const fonts = ['Public Sans', 'DM Sans', 'Geist', 'Inter', 'Poppins', 'Outfit', 'Raleway']

  const icons = [{
    label: 'Lucide',
    icon: 'i-lucide-feather',
    value: 'lucide'
  }, {
    label: 'Phosphor',
    icon: 'i-ph-phosphor-logo',
    value: 'phosphor'
  }, {
    label: 'Tabler',
    icon: 'i-tabler-brand-tabler',
    value: 'tabler'
  }]
  const icon = computed({
    get() {
      return _iconSet.value
    },
    set(option) {
      _iconSet.value = option
      appConfig.ui.icons = themeIcons[option as keyof typeof themeIcons] as any
    }
  })

  const modes = computed(() => [
    { label: 'light', icon: appConfig.ui.icons.light },
    { label: 'dark', icon: appConfig.ui.icons.dark },
    { label: 'system', icon: appConfig.ui.icons.system }
  ])
  const mode = computed({
    get() {
      return colorMode.value
    },
    set(option) {
      colorMode.preference = option
    }
  })

  const radiusStyle = computed(() => `:root { --ui-radius: ${radius.value}rem; }`)
  const blackAsPrimaryStyle = computed(() => blackAsPrimary.value ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')
  const fontStyle = computed(() => `:root { --font-sans: '${font.value}', sans-serif; }`)

  const link = computed(() => {
    const name = font.value
    if (name === 'Public Sans' || !fonts.includes(name)) return []
    return [{
      rel: 'stylesheet' as const,
      href: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;500;600;700&display=swap`,
      id: `font-${kebabCase(name)}`
    }]
  })

  const style = [
    { innerHTML: radiusStyle, id: `${site.name}-ui-radius`, tagPriority: -2 },
    { innerHTML: blackAsPrimaryStyle, id: `${site.name}-ui-black-as-primary`, tagPriority: -2 },
    { innerHTML: fontStyle, id: `${site.name}-ui-font`, tagPriority: -2 }
  ]

  const hasCSSChanges = computed(() => {
    return radius.value !== 0.25
      || blackAsPrimary.value
      || font.value !== 'Public Sans'
  })

  const hasAppConfigChanges = computed(() => {
    return appConfig.ui.colors.primary !== 'green'
      || appConfig.ui.colors.neutral !== 'slate'
      || _iconSet.value !== 'lucide'
  })

  function exportCSS(): string {
    const lines = [
      '@import "tailwindcss";',
      '@import "@nuxt/ui";'
    ]

    if (font.value !== 'Public Sans') {
      lines.push('', '@theme {', `  --font-sans: '${font.value}', sans-serif;`, '}')
    }

    const rootLines: string[] = []
    if (radius.value !== 0.25) {
      rootLines.push(`  --ui-radius: ${radius.value}rem;`)
    }
    if (blackAsPrimary.value) {
      rootLines.push('  --ui-primary: black;')
    }

    if (rootLines.length) {
      lines.push('', ':root {', ...rootLines, '}')
    }

    const darkLines: string[] = []
    if (blackAsPrimary.value) {
      darkLines.push('  --ui-primary: white;')
    }

    if (darkLines.length) {
      lines.push('', '.dark {', ...darkLines, '}')
    }
    return lines.join('\n')
  }

  function exportAppConfig(): string {
    const config: Record<string, any> = {}

    const defaultColors: Record<string, string> = { primary: 'green', neutral: 'slate', secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red' }
    const colorEntries = Object.entries(defaultColors).filter(([key, def]) => (appConfig.ui.colors as any)[key] !== def)
    if (colorEntries.length) {
      config.ui = { colors: Object.fromEntries(colorEntries.map(([key]) => [key, (appConfig.ui.colors as any)[key]])) }
    }

    if (_iconSet.value !== 'lucide') {
      const iconMapping = themeIcons[_iconSet.value as keyof typeof themeIcons]
      config.ui = config.ui || {}
      config.ui.icons = iconMapping
    }

    const configString = JSON.stringify(config, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, '\'')

    return `export default defineAppConfig(${configString})`
  }

  function resetTheme() {
    appConfig.ui.colors.primary = 'green'
    window.localStorage.removeItem(`${site.name}-ui-primary`)

    appConfig.ui.colors.neutral = 'slate'
    window.localStorage.removeItem(`${site.name}-ui-neutral`)

    radius.value = 0.25
    font.value = 'Public Sans'
    _iconSet.value = 'lucide'
    appConfig.ui.icons = themeIcons.lucide as any
    blackAsPrimary.value = false

    window.localStorage.removeItem(`${site.name}-ui-ai-theme`)
    window.localStorage.removeItem(`${site.name}-ui-custom-colors`)
    window.localStorage.removeItem(`${site.name}-ui-css-variables`)
  }

  return {
    style,
    link,
    neutralColors,
    neutral,
    primaryColors,
    primary,
    blackAsPrimary,
    radiuses,
    radius,
    fonts,
    font,
    icon,
    icons,
    modes,
    mode,
    hasCSSChanges,
    hasAppConfigChanges,
    exportCSS,
    exportAppConfig,
    resetTheme
  }
}
