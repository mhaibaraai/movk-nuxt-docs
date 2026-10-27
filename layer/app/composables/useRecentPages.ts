import { kebabCase } from '@movk/core'
import { useLocalStorage } from '@vueuse/core'
import type { RecentPage } from '../utils/recent-pages'
import { pushRecentPage } from '../utils/recent-pages'

const STORED_LIMIT = 12
const VISIBLE_LIMIT = 6

/** 最近访问的文档页，按当前语言的文档根路径过滤 */
export function useRecentPages() {
  const site = useSiteConfig()
  const { docsRoot } = useMovkI18n()

  const stored = useLocalStorage<RecentPage[]>(`${kebabCase(site.name)}-recent-pages`, [])

  const pages = computed(() => stored.value
    .filter(page => page.path.startsWith(`${docsRoot.value}/`))
    .slice(0, VISIBLE_LIMIT))

  function record(page: RecentPage) {
    stored.value = pushRecentPage(stored.value, page, STORED_LIMIT)
  }

  return {
    pages,
    record
  }
}
