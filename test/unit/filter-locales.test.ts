import { describe, expect, it } from 'vitest'
import { filterValidLocales, mergeLocaleMessages } from '../../layer/utils/locale'

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

describe('mergeLocaleMessages', () => {
  const builtinEn = { docs: { overview: 'Overview', copyCode: 'Copy' } }

  it('站点翻译覆盖内置文案，未覆盖的键保留内置值', () => {
    expect(mergeLocaleMessages({ docs: { overview: 'Start here' } }, builtinEn, builtinEn)).toEqual({
      docs: { overview: 'Start here', copyCode: 'Copy' }
    })
  })

  it('内置没有的语言以英文内置文案补齐缺失的键', () => {
    expect(mergeLocaleMessages({ docs: { overview: '概要' } }, undefined, builtinEn)).toEqual({
      docs: { overview: '概要', copyCode: 'Copy' }
    })
  })

  it('没有站点翻译时返回内置文案且不修改入参', () => {
    const builtin = { docs: { overview: '概览' } }
    const merged = mergeLocaleMessages(undefined, builtin, builtinEn)
    expect(merged).toEqual(builtin)
    expect(merged).not.toBe(builtin)
  })
})
