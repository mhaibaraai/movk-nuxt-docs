import { resolveThemeIcons, themeIcons } from '../utils/theme'
import { omit, kebabCase } from '@movk/core'
import { useLocalStorage } from '@vueuse/core'
import colors from 'tailwindcss/colors'

/** 与 main.css 中自定义 neutral 色阶的首尾色保持一致，用于 theme-color */
const CUSTOM_NEUTRALS: Record<string, Record<50 | 950, string>> = {
  paper: { 50: '#faf9f5', 950: '#141413' }
}

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
    primary: appConfig.ui.colors.primary,
    neutral: appConfig.ui.colors.neutral,
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

  const color = computed(() => {
    const shades = (colors as any)[appConfig.ui.colors.neutral] ?? CUSTOM_NEUTRALS[appConfig.ui.colors.neutral]
    return colorMode.value === 'dark' ? shades?.[950] : shades?.[50]
  })

  const _radius = useLocalStorage(`${name}-ui-radius`, defaults.value.radius)
  const _iconSet = useLocalStorage(`${name}-ui-icons`, defaults.value.icons)
  const _blackAsPrimary = useLocalStorage(`${name}-ui-black-as-primary`, defaults.value.blackAsPrimary)

  const neutralColors = ['paper', 'slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']
  const neutral = computed({
    get() {
      return appConfig.ui.colors.neutral
    },
    set(option) {
      appConfig.ui.colors.neutral = option
      window.localStorage.setItem(`${name}-ui-neutral`, appConfig.ui.colors.neutral)
    }
  })

  const colorsToOmit = ['inherit', 'current', 'transparent', 'black', 'white', ...neutralColors]
  const primaryColors = ['vermilion', ...Object.keys(omit(colors, colorsToOmit as any))]
  const primary = computed({
    get() {
      return appConfig.ui.colors.primary
    },
    set(option) {
      appConfig.ui.colors.primary = option
      window.localStorage.setItem(`${name}-ui-primary`, appConfig.ui.colors.primary)
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
    return _radius.value !== defaults.value.radius
      || _blackAsPrimary.value !== defaults.value.blackAsPrimary
  })

  const hasConfigChanges = computed(() => {
    return appConfig.ui.colors.primary !== defaults.value.primary
      || appConfig.ui.colors.neutral !== defaults.value.neutral
      || _iconSet.value !== defaults.value.icons
  })

  function exportCSS(): string {
    const lines: string[] = []

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

    const defaultColors: Record<string, string> = { secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red', primary: defaults.value.primary, neutral: defaults.value.neutral }
    const colorEntries = Object.entries(defaultColors).filter(([key, def]) => (appConfig.ui.colors as any)[key] !== def)
    if (colorEntries.length) {
      config.ui = { colors: Object.fromEntries(colorEntries.map(([key]) => [key, (appConfig.ui.colors as any)[key]])) }
    }

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
    appConfig.ui.colors.primary = defaults.value.primary
    window.localStorage.removeItem(`${name}-ui-primary`)

    appConfig.ui.colors.neutral = defaults.value.neutral
    window.localStorage.removeItem(`${name}-ui-neutral`)

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
