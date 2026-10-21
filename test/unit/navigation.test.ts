import type { ContentNavigationItem } from '@nuxt/content'
import { describe, expect, it } from 'vitest'
import { transformNavigation } from '../../layer/app/utils/navigation'

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
