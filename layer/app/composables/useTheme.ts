import { resolveThemeIcons, themeIcons } from '../utils/theme'
import { omit, kebabCase } from '@movk/core'
import { useLocalStorage } from '@vueuse/core'
import colors from 'tailwindcss/colors'
import { DEFAULT_PALETTES, paletteShade, resolveThemeColor } from '../utils/theme-palette'

export interface ThemeDefaults {
  primary: string
  neutral: string
  radius: number
  icons: string
  blackAsPrimary: boolean
}

/** 站点在 app.config 中配置的主题，访客偏好覆盖前的基准值 */
export function useThemeDefaults() {
  const appConfig = useAppConfig()
  return useState<ThemeDefaults>('movk-theme-defaults', () => ({
    primary: DEFAULT_PALETTES.primary,
    neutral: DEFAULT_PALETTES.neutral,
    radius: appConfig.theme?.radius ?? 0.25,
    icons: appConfig.theme?.icons ?? 'lucide',
    blackAsPrimary: appConfig.theme?.blackAsPrimary ?? false
  }))
}

export function useTheme() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()
  const site = useSiteConfig()
  const name = kebabCase(site.name)
  const defaults = useThemeDefaults()

  const _primary = useState('movk-theme-primary', () => defaults.value.primary)
  const _neutral = useState('movk-theme-neutral', () => defaults.value.neutral)
  const color = computed(() => resolveThemeColor(_neutral.value, colorMode.value))

  const _radius = useLocalStorage(`${name}-ui-radius`, defaults.value.radius)
  const _iconSet = useLocalStorage(`${name}-ui-icons`, defaults.value.icons)
  const _blackAsPrimary = useLocalStorage(`${name}-ui-black-as-primary`, defaults.value.blackAsPrimary)

  const neutralColors = ['paper', 'slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']
  const neutral = computed({
    get() {
      return _neutral.value
    },
    set(option) {
      if (!paletteShade(option, 500)) return
      _neutral.value = option
      if (import.meta.client) window.localStorage.setItem(`${name}-ui-neutral`, option)
    }
  })

  const colorsToOmit = ['inherit', 'current', 'transparent', 'black', 'white', ...neutralColors]
  const primaryColors = ['vermilion', ...Object.keys(omit(colors, colorsToOmit as any))]
  const primary = computed({
    get() {
      return _primary.value
    },
    set(option) {
      if (!paletteShade(option, 500)) return
      _primary.value = option
      if (import.meta.client) window.localStorage.setItem(`${name}-ui-primary`, option)
      setBlackAsPrimary(false)
    }
  })

  const radiuses = [0, 0.125, 0.25, 0.375, 0.5]
  const radius = computed({
    get() {
      return _radius.value
    },
    set(option) {
      _radius.value = option
    }
  })

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
      appConfig.ui.icons = resolveThemeIcons(option, appConfig.ui.icons) as any
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

  const blackAsPrimary = computed(() => _blackAsPrimary.value)

  function setBlackAsPrimary(value: boolean) {
    _blackAsPrimary.value = value
  }

  const radiusStyle = computed(() => `:root { --ui-radius: ${_radius.value}rem; }`)
  const blackAsPrimaryStyle = computed(() => _blackAsPrimary.value ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')

  const style = [
    { innerHTML: radiusStyle, id: `nuxt-ui-radius`, tagPriority: -2 },
    { innerHTML: blackAsPrimaryStyle, id: `nuxt-ui-black-as-primary`, tagPriority: -2 }
  ]

  const hasCSSChanges = computed(() => {
    return _primary.value !== defaults.value.primary
      || _neutral.value !== defaults.value.neutral
      || _radius.value !== defaults.value.radius
      || _blackAsPrimary.value !== defaults.value.blackAsPrimary
  })

  const hasConfigChanges = computed(() => {
    return _iconSet.value !== defaults.value.icons
  })

  function exportCSS(): string {
    const lines: string[] = []
    const palettes = [
      ...(_primary.value !== defaults.value.primary ? [`  primary: ${_primary.value};`] : []),
      ...(_neutral.value !== defaults.value.neutral ? [`  neutral: ${_neutral.value};`] : [])
    ]
    if (palettes.length) lines.push('@plugin "@nuxt/ui/colors" {', ...palettes, '}', '')

    const rootLines: string[] = []
    if (_radius.value !== defaults.value.radius) {
      rootLines.push(`  --ui-radius: ${_radius.value}rem;`)
    }
    if (_blackAsPrimary.value) {
      rootLines.push('  --ui-primary: black;')
    }

    if (rootLines.length) {
      lines.push(':root {', ...rootLines, '}')
    }

    const darkLines: string[] = []
    if (_blackAsPrimary.value) {
      darkLines.push('  --ui-primary: white;')
    }

    if (darkLines.length) {
      lines.push('', '.dark {', ...darkLines, '}')
    }
    return lines.join('\n')
  }

  function exportConfig(): string {
    const config: Record<string, any> = {}

    if (_iconSet.value !== defaults.value.icons) {
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
    _primary.value = defaults.value.primary
    _neutral.value = defaults.value.neutral
    if (import.meta.client) {
      window.localStorage.removeItem(`${name}-ui-primary`)
      window.localStorage.removeItem(`${name}-ui-neutral`)
    }

    _radius.value = defaults.value.radius
    _iconSet.value = defaults.value.icons
    appConfig.ui.icons = resolveThemeIcons(defaults.value.icons, appConfig.ui.icons) as any
    _blackAsPrimary.value = defaults.value.blackAsPrimary
  }

  return {
    color,
    style,
    neutralColors,
    neutral,
    primaryColors,
    primary,
    blackAsPrimary,
    setBlackAsPrimary,
    radiuses,
    radius,
    icon,
    icons,
    modes,
    mode,
    hasCSSChanges,
    hasConfigChanges,
    configLabel: 'app.config.ts',
    exportCSS,
    exportConfig,
    resetTheme
  }
}
