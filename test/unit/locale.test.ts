import { describe, expect, it } from 'vitest'
import { collectionName, localeCode, localeName, normalizeLocaleId, resolveDocsLocale } from '../../layer/utils/locale'

describe('locale', () => {
  it('兼容字符串与对象形式的 locale', () => {
    expect(localeCode('en')).toBe('en')
    expect(localeCode({ code: 'zh-CN', name: '简体中文' })).toBe('zh-CN')
    expect(localeName({ code: 'zh-CN', name: '简体中文' })).toBe('简体中文')
    expect(localeName({ code: 'en' })).toBe('en')
    expect(localeName('ja')).toBe('ja')
  })

  it('集合名：默认语言用基础名，其余语言追加规范化后缀', () => {
    expect(normalizeLocaleId('zh-Hant-TW')).toBe('zh_Hant_TW')
    expect(collectionName('docs', 'zh-CN', 'zh-CN')).toBe('docs')
    expect(collectionName('docs', 'en', 'zh-CN')).toBe('docs_en')
    expect(collectionName('docs', 'zh-CN', undefined)).toBe('docs_zh_CN')
  })

  it('文档语言：未启用 i18n 时始终为默认集合', () => {
    const target = { locale: '', collection: 'docs', docsRoot: '/docs' }
    expect(resolveDocsLocale(undefined, { locales: [] })).toEqual(target)
    expect(resolveDocsLocale('en', { locales: [] })).toEqual(target)
  })

  it('文档语言：按请求的 locale 解析集合与路由前缀', () => {
    const options = { defaultLocale: 'zh-CN', locales: ['zh-CN', 'en'] }
    expect(resolveDocsLocale(undefined, options)).toEqual({ locale: 'zh-CN', collection: 'docs', docsRoot: '/docs' })
    expect(resolveDocsLocale('zh-CN', options)).toEqual({ locale: 'zh-CN', collection: 'docs', docsRoot: '/docs' })
    expect(resolveDocsLocale('en', options)).toEqual({ locale: 'en', collection: 'docs_en', docsRoot: '/en/docs' })
  })

  it('文档语言：未注册的 locale 返回 null', () => {
    expect(resolveDocsLocale('ja', { defaultLocale: 'zh-CN', locales: ['zh-CN', 'en'] })).toBeNull()
  })
})
