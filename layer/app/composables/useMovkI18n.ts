import { useAppConfig, useNuxtApp, useRuntimeConfig } from '#imports'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { collectionName } from '../../utils/locale'

export interface MovkLocale {
  code: string
  name: string
  language?: string
  dir?: 'ltr' | 'rtl'
}

type TranslateParams = Record<string, string | number>

interface MovkI18n {
  isEnabled: boolean
  locale: Ref<string>
  defaultLocale: string
  locales: MovkLocale[]
  t: (key: string, params?: TranslateParams) => string
  localePath: (path: string) => string
  switchLocalePath: (code?: string) => string
  docsRoot: ComputedRef<string>
  docsCollection: ComputedRef<string>
  landingCollection: ComputedRef<string>
  releasesCollection: ComputedRef<string>
  templatesCollection: ComputedRef<string>
}

type MovkNuxtApp = ReturnType<typeof useNuxtApp> & {
  $i18n?: {
    locale: Ref<string>
    defaultLocale: string
    t: (key: string, params?: TranslateParams) => string
  }
  $localePath?: (path: string) => string
  $switchLocalePath?: (code?: string) => string
  $movkLocale?: string
  $movkLocaleMessages?: Record<string, unknown>
}

function resolveMessage(messages: Record<string, unknown>, key: string, params?: TranslateParams): string {
  const value = key.split('.').reduce<unknown>(
    (acc, segment) => (acc as Record<string, unknown> | undefined)?.[segment],
    messages
  )

  if (typeof value !== 'string') return key
  if (!params) return value

  return value.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? ''))
}

/**
 * 统一的 i18n 访问入口，兼容两种模式：
 * - 消费方启用 @nuxtjs/i18n：委托给 Nuxt i18n 的 locale / t / localePath / switchLocalePath
 * - 未启用：回退到由 i18n 插件注入的单 locale 消息，路由不做本地化
 */
export function useMovkI18n(): MovkI18n {
  const publicConfig = useRuntimeConfig().public as unknown as {
    i18n?: { defaultLocale?: string }
    movkDocs?: { filteredLocales?: MovkLocale[] }
  }
  const nuxtApp = useNuxtApp() as MovkNuxtApp
  const isEnabled = !!publicConfig.i18n

  if (!isEnabled) {
    const appConfig = useAppConfig()
    const messages = nuxtApp.$movkLocaleMessages || {}
    const code = nuxtApp.$movkLocale || appConfig.i18n?.locale || 'zh-CN'

    return {
      isEnabled,
      locale: ref(code),
      defaultLocale: code,
      locales: [],
      t: (key, params) => resolveMessage(messages, key, params),
      localePath: path => path,
      switchLocalePath: () => '',
      docsRoot: computed(() => '/docs'),
      docsCollection: computed(() => 'docs'),
      landingCollection: computed(() => 'landing'),
      releasesCollection: computed(() => 'releases'),
      templatesCollection: computed(() => 'templates')
    }
  }

  const i18n = nuxtApp.$i18n!
  const locale = i18n.locale
  const defaultLocale = publicConfig.i18n?.defaultLocale || i18n.defaultLocale
  const localePath = nuxtApp.$localePath || ((path: string) => path)

  return {
    isEnabled,
    locale,
    defaultLocale,
    locales: publicConfig.movkDocs?.filteredLocales || [],
    t: (key, params) => i18n.t(key, params || {}),
    localePath,
    switchLocalePath: nuxtApp.$switchLocalePath || (() => ''),
    docsRoot: computed(() => locale.value === defaultLocale ? '/docs' : `/${locale.value}/docs`),
    docsCollection: computed(() => collectionName('docs', locale.value, defaultLocale)),
    landingCollection: computed(() => collectionName('landing', locale.value, defaultLocale)),
    releasesCollection: computed(() => collectionName('releases', locale.value, defaultLocale)),
    templatesCollection: computed(() => collectionName('templates', locale.value, defaultLocale))
  }
}
