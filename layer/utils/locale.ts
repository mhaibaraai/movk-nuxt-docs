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
