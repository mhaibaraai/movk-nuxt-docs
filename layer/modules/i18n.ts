import { createResolver, defineNuxtModule, logger } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import { localeCode, localeName, type I18nLocale } from '../utils/locale'

const log = logger.withTag('movk-docs')

interface I18nOptions {
  defaultLocale?: string
  locales?: I18nLocale[]
  strategy?: string
  experimental?: Record<string, unknown>
}

interface RegisterModuleOptions {
  langDir: string
  locales: Array<{ code: string, name: string, file: string }>
}

/**
 * 条件激活 i18n：仅当消费方在 nuxt.config 配置了 i18n.locales 时生效。
 * 过滤无效 locale、强制 prefix_except_default 策略、注册内置翻译文件、
 * 暴露有效 locale 列表，并预渲染非默认语言入口。
 */
export default defineNuxtModule({
  meta: {
    name: 'movk-i18n'
  },
  setup(_options, nuxt) {
    const typed = nuxt.options as typeof nuxt.options & { i18n?: I18nOptions }
    const i18n = typed.i18n

    if (!i18n || typeof i18n !== 'object' || !Array.isArray(i18n.locales) || !i18n.locales.length) {
      return
    }

    const { resolve } = createResolver(import.meta.url)
    const langDir = resolve('../i18n/locales')
    const defaultLocale = i18n.defaultLocale || localeCode(i18n.locales[0]!)
    const rootDir = nuxt.options.rootDir

    // 有效 locale 需同时具备翻译文件与内容目录（默认语言内容位于 content/ 根）
    const filteredLocales = i18n.locales.filter((locale) => {
      const code = localeCode(locale)
      const hasFile = existsSync(join(langDir, `${code}.json`))
      const hasContent = code === defaultLocale || existsSync(join(rootDir, 'content', code))

      if (!hasFile) log.warn(`缺少翻译文件 ${code}.json，已跳过 locale "${code}"`)
      if (!hasContent) log.warn(`缺少内容目录 content/${code}/，已跳过 locale "${code}"`)

      return hasFile && hasContent
    })

    if (!filteredLocales.length) return

    // 默认语言保留无前缀路由（/docs），其余语言加前缀（/en/docs）
    // 开启 typed messages：原生 useI18n().t / $t 自动按默认语言推断 key，获得补全
    typed.i18n = {
      ...i18n,
      strategy: 'prefix_except_default',
      experimental: { ...i18n.experimental, typedOptionsAndMessages: 'default' }
    }

    nuxt.options.runtimeConfig.public.movkDocs = {
      ...(nuxt.options.runtimeConfig.public.movkDocs as Record<string, unknown> | undefined),
      filteredLocales: filteredLocales.map(locale => ({
        code: localeCode(locale),
        name: localeName(locale)
      }))
    }

    const registerI18n = nuxt.hook as unknown as (
      name: 'i18n:registerModule',
      cb: (register: (options: RegisterModuleOptions) => void) => void
    ) => void

    registerI18n('i18n:registerModule', (register) => {
      register({
        langDir,
        locales: filteredLocales.map(locale => ({
          code: localeCode(locale),
          name: localeName(locale),
          file: `${localeCode(locale)}.json`
        }))
      })
    })

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.prerender ||= {}
      nitroConfig.prerender.routes ||= []
      for (const locale of filteredLocales) {
        const code = localeCode(locale)
        if (code !== defaultLocale) {
          nitroConfig.prerender.routes.push(`/${code}`)
        }
      }
    })
  }
})
