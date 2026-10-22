import type { H3Event } from 'h3'
import { z } from 'zod'
import { resolveDocsLocale, type DocsLocaleTarget } from '../../utils/locale'

/** MCP 工具与提示词共用的 locale 入参 */
export const docsLocaleInput = z.string().optional()
  .describe('Content language code (e.g. "en"). Only applies to multilingual sites; defaults to the site default language.')

/** 按请求语言解析文档集合与路由前缀，未注册的语言抛出 400 并列出可用语言 */
export function useDocsLocale(event: H3Event, locale?: string): DocsLocaleTarget {
  const config = useRuntimeConfig(event).public as unknown as {
    i18n?: { defaultLocale?: string }
    movkDocs?: { filteredLocales?: Array<{ code: string }> }
  }
  const locales = config.movkDocs?.filteredLocales?.map(item => item.code) ?? []
  const target = resolveDocsLocale(locale, { defaultLocale: config.i18n?.defaultLocale, locales })

  if (!target) {
    throw createError({ statusCode: 400, message: `Unknown locale '${locale}'. Available locales: ${locales.join(', ')}` })
  }
  return target
}
