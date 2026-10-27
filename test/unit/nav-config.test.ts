import { describe, expect, it } from 'vitest'
import { resolveCategories, resolveLocalized, resolveNavLinks } from '../../layer/app/utils/nav-config'

describe('resolveLocalized', () => {
  it('字符串原样返回', () => {
    expect(resolveLocalized('文档', 'en', 'zh-CN')).toBe('文档')
  })

  it('按当前语言、默认语言、首个值依次回退', () => {
    const text = { 'zh-CN': '文档', 'en': 'Docs' }
    expect(resolveLocalized(text, 'en', 'zh-CN')).toBe('Docs')
    expect(resolveLocalized(text, 'ja', 'zh-CN')).toBe('文档')
    expect(resolveLocalized({ fr: 'Docs FR' }, 'ja', 'zh-CN')).toBe('Docs FR')
    expect(resolveLocalized(undefined, 'en', 'zh-CN')).toBe('')
  })
})

describe('resolveNavLinks', () => {
  const context = {
    locale: 'en',
    defaultLocale: 'zh-CN',
    path: '/en/docs/components/button',
    localePath: (path: string) => `/en${path}`
  }

  it('本地化文案与站内链接，并按前缀计算激活状态', () => {
    const links = resolveNavLinks([
      { label: { 'zh-CN': '文档', 'en': 'Docs' }, to: '/docs/getting-started', activeMatch: '/docs' },
      { label: '案例', to: '/templates', icon: 'i-lucide-layout-template' }
    ], context)

    expect(links).toEqual([
      { label: 'Docs', to: '/en/docs/getting-started', active: true },
      { label: '案例', to: '/en/templates', icon: 'i-lucide-layout-template', active: false }
    ])
  })

  it('外部链接不加前缀且默认新窗口打开', () => {
    expect(resolveNavLinks([{ label: 'GitHub', to: 'https://github.com/x', icon: 'i-simple-icons-github' }], context)).toEqual([
      { label: 'GitHub', to: 'https://github.com/x', icon: 'i-simple-icons-github', target: '_blank', active: false }
    ])
  })

  it('未配置 activeMatch 时以 to 为前缀；显式 active 优先', () => {
    const links = resolveNavLinks([
      { label: 'Button', to: '/docs/components' },
      { label: 'Off', to: '/docs', active: false }
    ], context)
    expect(links.map(link => link.active)).toEqual([true, false])
  })

  it('不修改输入', () => {
    const items = [{ label: { en: 'Docs' }, to: '/docs' }]
    const snapshot = structuredClone(items)
    resolveNavLinks(items, context)
    expect(items).toEqual(snapshot)
  })
})

describe('resolveCategories', () => {
  it('本地化分类标题', () => {
    expect(resolveCategories({
      'getting-started': [{ id: 'ai', title: { 'zh-CN': 'AI 集成', 'en': 'AI' }, icon: 'i-lucide-bot' }]
    }, 'en', 'zh-CN')).toEqual({
      'getting-started': [{ id: 'ai', title: 'AI', icon: 'i-lucide-bot' }]
    })
    expect(resolveCategories(undefined, 'en', 'zh-CN')).toEqual({})
  })
})
