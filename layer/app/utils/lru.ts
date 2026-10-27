export interface LruCache<K, V> {
  get: (key: K) => V | undefined
  set: (key: K, value: V) => void
  has: (key: K) => boolean
  readonly size: number
}

/** 基于 Map 插入顺序的 LRU 缓存，读取与写入都会把键移到最新位置 */
export function createLruCache<K, V>(max: number): LruCache<K, V> {
  if (!Number.isInteger(max) || max < 1) {
    throw new RangeError(`LRU 容量必须为正整数，收到 ${max}`)
  }

  const store = new Map<K, V>()

  return {
    get(key) {
      if (!store.has(key)) return undefined
      const value = store.get(key)!
      store.delete(key)
      store.set(key, value)
      return value
    },
    set(key, value) {
      store.delete(key)
      store.set(key, value)
      if (store.size > max) {
        store.delete(store.keys().next().value!)
      }
    },
    has: key => store.has(key),
    get size() {
      return store.size
    }
  }
}
