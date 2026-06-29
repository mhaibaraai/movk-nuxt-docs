import { addRouteMiddleware, defineNuxtPlugin, navigateTo, useAppConfig, useRuntimeConfig } from '#imports'
import { unref } from 'vue'

// 懒导入 locale 文件（打包但不预加载），仅在未启用 @nuxtjs/i18n 时按需读取单个 locale。
const localeFiles = import.meta.glob<{ default: Record<string, unknown> }>('../../i18n/locales/*.json')

async function loadLocale(code: string): Promise<Record<string, unknown> | null> {
  const loader = localeFiles[`../../i18n/locales/${code}.json`]
  return loader ? (await loader()).default : null
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig().public

  // 启用 @nuxtjs/i18n 时由其接管 locale 行为；prefix_except_default 下根路径以默认语言提供，
  // 若浏览器语言检测得到非默认语言，则将根路径重定向到带前缀首页，避免界面/内容语言错配。
  if (config.i18n) {
    const i18n = nuxtApp.$i18n as { locale?: unknown, defaultLocale?: string } | undefined
    const defaultLocale = (config.i18n as { defaultLocale?: string }).defaultLocale || i18n?.defaultLocale

    addRouteMiddleware((to) => {
      if (to.path !== '/' || !defaultLocale) return
      const detected = unref(i18n?.locale) as string | undefined
      if (detected && detected !== defaultLocale) {
        return navigateTo(`/${detected}`)
      }
    })
    return
  }

  const appConfig = useAppConfig()
  const configured = appConfig.i18n?.locale || 'zh-CN'
  const messages = await loadLocale(configured)

  if (messages) {
    nuxtApp.provide('movkLocale', configured)
    nuxtApp.provide('movkLocaleMessages', messages)
    return
  }

  nuxtApp.provide('movkLocale', 'zh-CN')
  nuxtApp.provide('movkLocaleMessages', (await loadLocale('zh-CN')) || {})
})
