import { describe, expect, it } from 'vitest'
import { pushRecentPage } from '../../layer/app/utils/recent-pages'

describe('pushRecentPage', () => {
  const a = { path: '/docs/a', title: 'A' }
  const b = { path: '/docs/b', title: 'B' }
  const c = { path: '/docs/c', title: 'C' }

  it('新页面放在最前', () => {
    expect(pushRecentPage([a, b], c)).toEqual([c, a, b])
  })

  it('已存在的页面移到最前并更新标题', () => {
    expect(pushRecentPage([a, b, c], { path: '/docs/b', title: 'B2' })).toEqual([{ path: '/docs/b', title: 'B2' }, a, c])
  })

  it('超出上限时截断最旧的记录', () => {
    expect(pushRecentPage([a, b], c, 2)).toEqual([c, a])
  })

  it('不修改原数组', () => {
    const list = [a, b]
    pushRecentPage(list, c)
    expect(list).toEqual([a, b])
  })
})
