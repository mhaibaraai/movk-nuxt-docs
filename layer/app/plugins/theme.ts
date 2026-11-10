import { resolveThemeIcons } from '../utils/theme'
import { kebabCase } from '@movk/core'
import { applyPaletteVars, colorsStorageKey, createColorRestoreScript, parsePaletteVars, resolvePaletteVars } from '../utils/theme-palette'
import type { PaletteVars } from '../utils/theme-palette'

export default defineNuxtPlugin({
  name: 'docs-theme',
  enforce: 'post',
  // @ts-ignore 可选消费方插件不在独立 Layer 的生成名称清单中，运行时只等待实际存在的插件。
  dependsOn: ['docs-theme-provider'],
  setup(nuxtApp) {
    if (nuxtApp.$docsTheme) return

    const appConfig = useAppConfig()
    const site = useSiteConfig()
    const name = kebabCase(site.name)

    // 在应用访客偏好前记录站点配置的主题，作为重置与差异比较的基准；
    // 客户端沿用服务端写入 payload 的值，避免读到已被 localStorage 覆盖的配置
    const defaults = useDocsThemeDefaults()

    if (defaults.value.icons !== 'lucide') {
      appConfig.ui.icons = resolveThemeIcons(defaults.value.icons, appConfig.ui.icons) as any
    }

    if (import.meta.client) {
      const blackAsPrimary = localStorage.getItem(`${name}-ui-black-as-primary`)
      const theme = useDocsTheme()
      const primary = localStorage.getItem(`${name}-ui-primary`)
      if (primary) theme.primary.value = primary
      const neutral = localStorage.getItem(`${name}-ui-neutral`)
      if (neutral) theme.neutral.value = neutral
      // 恢复色板不是一次用户切色操作，不应清除已保存的黑白主色偏好。
      theme.setBlackAsPrimary(blackAsPrimary === null ? defaults.value.blackAsPrimary : blackAsPrimary === 'true')

      let previous: PaletteVars = parsePaletteVars(localStorage.getItem(colorsStorageKey(name)))
      watch(() => resolvePaletteVars({
        primary: theme.primary.value !== defaults.value.primary ? theme.primary.value : null,
        neutral: theme.neutral.value !== defaults.value.neutral ? theme.neutral.value : null
      }), (next) => {
        applyPaletteVars(document.documentElement, next, previous)
        previous = next
        localStorage.setItem(colorsStorageKey(name), JSON.stringify(next))
      }, { immediate: true })

      const colorMode = useColorMode()
      watch([theme.radius, theme.blackAsPrimary, () => colorMode.value], ([radius, black, mode]) => {
        document.documentElement.style.setProperty('--ui-radius', `${radius}rem`)
        if (black) document.documentElement.style.setProperty('--ui-primary', mode === 'dark' ? 'white' : 'black')
        else document.documentElement.style.removeProperty('--ui-primary')
      }, { immediate: true })

      const icons = localStorage.getItem(`${name}-ui-icons`)
      if (icons) appConfig.ui.icons = resolveThemeIcons(icons, appConfig.ui.icons) as any
    }

    if (import.meta.server) {
      useHead({
        script: [{
          innerHTML: createColorRestoreScript(name),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            var r = localStorage.getItem('${name}-ui-radius');
            if (r) document.documentElement.style.setProperty('--ui-radius', r + 'rem');
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            if (localStorage.getItem('${name}-ui-black-as-primary') === 'true') {
              var isDark = document.documentElement.classList.contains('dark');
              document.documentElement.style.setProperty('--ui-primary', isDark ? 'white' : 'black');
            }
          `.replace(/\s+/g, ' ')
        }]
      })
    }
  }
})
