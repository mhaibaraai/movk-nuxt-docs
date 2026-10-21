import { describe, expect, it } from 'vitest'
import { filterValidLocales } from '../../layer/utils/locale'

const translations = new Set(['en', 'zh-CN'])
const contents = new Set(['en'])
const options = {
  defaultLocale: 'zh-CN',
  hasTranslation: (code: string) => translations.has(code),
  hasContent: (code: string) => contents.has(code)
}

describe('filterValidLocales', () => {
  it('默认语言无需内容目录，其余语言需翻译文件与内容目录', () => {
    const { valid, skipped } = filterValidLocales(['zh-CN', { code: 'en', name: 'English' }, 'ja', 'fr'], options)
    expect(valid).toEqual(['zh-CN', { code: 'en', name: 'English' }])
    expect(skipped).toEqual([
      { code: 'ja', missing: ['translation', 'content'] },
      { code: 'fr', missing: ['translation', 'content'] }
    ])
  })

  it('仅缺内容目录时只报告 content', () => {
    const { skipped } = filterValidLocales(['zh-CN'], { ...options, defaultLocale: 'en' })
    expect(skipped).toEqual([{ code: 'zh-CN', missing: ['content'] }])
  })

  it('默认语言缺翻译文件同样跳过', () => {
    expect(filterValidLocales(['ja'], { ...options, defaultLocale: 'ja' }).skipped).toEqual([{ code: 'ja', missing: ['translation'] }])
  })
})
