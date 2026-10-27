import type { ContentNavigationItem } from '@nuxt/content'
import { describe, expect, it } from 'vitest'
import { groupByCategory, sectionLink, transformNavigation, undeclaredCategories } from '../../layer/app/utils/navigation'

const section = (path: string): ContentNavigationItem => ({ title: path, path })

describe('transformNavigation', () => {
  it('空数据返回空数组', () => {
    expect(transformNavigation(null, '/docs')).toEqual([])
    expect(transformNavigation([], '/docs')).toEqual([])
  })

  it('命中 docsRoot 时返回该节点（含多层嵌套）', () => {
    const docs = { title: 'Docs', path: '/en/docs', children: [section('/en/docs/a')] }
    expect(transformNavigation([{ title: 'en', path: '/en', children: [docs] }], '/en/docs')).toEqual([docs])
  })

  it('docsRoot 被折叠时合成包裹节点', () => {
    const data = [section('/docs/getting-started'), section('/docs/components')]
    expect(transformNavigation(data, '/docs')).toEqual([{ path: '/docs', title: '', children: data }])
  })
})

describe('groupByCategory', () => {
  const page = (path: string, category?: string): ContentNavigationItem => ({ title: path, path, ...(category ? { category } : {}) })
  const categories = { guide: [{ id: 'basics', title: '基础', icon: 'i-lucide-settings' }] }
  const group = (items: ContentNavigationItem[]) => groupByCategory(items, { slug: 'guide', docsRoot: '/docs', overviewTitle: '概览', categories })

  it('无分类页面归入概览，已声明分类按配置分组', () => {
    const intro = page('/docs/guide/intro')
    const config = page('/docs/guide/config', 'basics')
    expect(group([intro, config])).toEqual([
      { title: '概览', path: '/docs/guide', icon: 'i-lucide-house', children: [intro] },
      { title: '基础', path: '/docs/guide', icon: 'i-lucide-settings', children: [config] }
    ])
  })

  it('未声明的分类回退到概览分组而不是消失', () => {
    const orphan = page('/docs/guide/orphan', 'missing')
    expect(group([orphan])).toEqual([
      { title: '概览', path: '/docs/guide', icon: 'i-lucide-house', children: [orphan] }
    ])
  })

  it('带子节点的目录原样保留', () => {
    const folder = { title: 'Folder', path: '/docs/guide/folder', children: [page('/docs/guide/folder/a')] }
    expect(group([folder])).toEqual([folder])
  })
})

describe('undeclaredCategories', () => {
  it('列出未在配置中声明的分类', () => {
    const items = [{ title: 'a', path: '/a', category: 'basics' }, { title: 'b', path: '/b', category: 'missing' }]
    expect(undeclaredCategories(items, [{ id: 'basics', title: '基础', icon: '' }])).toEqual(['missing'])
  })
})

describe('sectionLink', () => {
  it('有首页的目录链接到自身', () => {
    expect(sectionLink({ title: 'Guide', path: '/docs/guide', children: [{ title: 'a', path: '/docs/guide/a' }] })).toBe('/docs/guide')
  })

  it('没有首页的目录链接到首篇（递归进入子目录）', () => {
    const item: ContentNavigationItem = {
      title: 'Guide',
      path: '/docs/guide',
      page: false,
      children: [{ title: 'Basics', path: '/docs/guide/basics', page: false, children: [{ title: 'a', path: '/docs/guide/basics/a' }] }]
    }
    expect(sectionLink(item)).toBe('/docs/guide/basics/a')
  })

  it('没有任何页面时回退到目录路径', () => {
    expect(sectionLink({ title: 'Empty', path: '/docs/empty', page: false })).toBe('/docs/empty')
  })
})
