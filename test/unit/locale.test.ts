import { describe, expect, it } from 'vitest'
import { collectionName, localeCode, localeName, normalizeLocaleId } from '../../layer/utils/locale'

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
})
