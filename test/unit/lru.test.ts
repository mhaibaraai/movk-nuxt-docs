import { describe, expect, it } from 'vitest'
import { createLruCache } from '../../layer/app/utils/lru'

describe('createLruCache', () => {
  it('超出容量时淘汰最久未使用的项', () => {
    const cache = createLruCache<string, number>(2)
    cache.set('a', 1)
    cache.set('b', 2)
    expect(cache.get('a')).toBe(1)
    cache.set('c', 3)
    expect(cache.has('b')).toBe(false)
    expect(cache.get('a')).toBe(1)
    expect(cache.get('c')).toBe(3)
    expect(cache.size).toBe(2)
  })

  it('覆盖已有键时刷新顺序且不扩容', () => {
    const cache = createLruCache<string, number>(2)
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('a', 10)
    cache.set('c', 3)
    expect(cache.get('a')).toBe(10)
    expect(cache.has('b')).toBe(false)
  })

  it('容量必须为正整数', () => {
    expect(() => createLruCache(0)).toThrow()
  })
})
