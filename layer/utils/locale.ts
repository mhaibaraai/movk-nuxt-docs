export type I18nLocale = string | { code: string, name?: string }

export const localeCode = (locale: I18nLocale): string =>
  typeof locale === 'string' ? locale : locale.code

export const localeName = (locale: I18nLocale): string =>
  typeof locale === 'string' ? locale : (locale.name || locale.code)

/**
 * 将 locale code 规范化为合法的集合名片段（连字符全部转下划线）
 */
export const normalizeLocaleId = (code: string): string => code.replaceAll('-', '_')

/**
 * 生成 Nuxt Content 集合名：默认语言用 base，其余语言用 base_{normalizedCode}
 */
export const collectionName = (base: string, code: string, defaultLocale: string | undefined): string =>
  code === defaultLocale ? base : `${base}_${normalizeLocaleId(code)}`

export interface DocsLocaleTarget {
  locale: string
  collection: string
  docsRoot: string
}

/**
 * 解析请求语言对应的文档集合与路由前缀：未启用 i18n 时忽略请求语言，
 * 缺省为默认语言，未注册的 locale 返回 null
 */
export function resolveDocsLocale(
  requested: string | undefined,
  { defaultLocale, locales }: { defaultLocale?: string, locales: string[] }
): DocsLocaleTarget | null {
  const fallback = defaultLocale ?? ''
  if (!locales.length) return { locale: fallback, collection: 'docs', docsRoot: '/docs' }

  const code = requested || fallback
  if (!locales.includes(code)) return null

  return {
    locale: code,
    collection: collectionName('docs', code, defaultLocale),
    docsRoot: code === defaultLocale ? '/docs' : `/${code}/docs`
  }
}

export type LocaleRequirement = 'translation' | 'content'

export interface LocaleFilterOptions {
  defaultLocale: string
  hasTranslation: (code: string) => boolean
  /** 默认语言内容位于 content/ 根目录，不做检查 */
  hasContent: (code: string) => boolean
}

/**
 * 有效 locale 需同时具备内置翻译文件与内容目录，返回有效列表与被跳过的原因
 */
export function filterValidLocales(locales: I18nLocale[], { defaultLocale, hasTranslation, hasContent }: LocaleFilterOptions) {
  const valid: I18nLocale[] = []
  const skipped: Array<{ code: string, missing: LocaleRequirement[] }> = []

  for (const locale of locales) {
    const code = localeCode(locale)
    const missing: LocaleRequirement[] = []
    if (!hasTranslation(code)) missing.push('translation')
    if (code !== defaultLocale && !hasContent(code)) missing.push('content')

    if (missing.length) skipped.push({ code, missing })
    else valid.push(locale)
  }

  return { valid, skipped }
}
