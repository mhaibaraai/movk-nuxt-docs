import { markRaw } from 'vue'
import { createLruCache } from '../utils/lru'

// ComponentCode 每次修改属性都会生成新代码，服务端也会跨请求复用，需限制容量
const cache = createLruCache<string, any>(200)

export async function cachedParseMarkdown(markdown: string) {
  const cached = cache.get(markdown)
  if (cached) return cached

  const result = markRaw(await parseMarkdown(markdown))
  cache.set(markdown, result)
  return result
}
