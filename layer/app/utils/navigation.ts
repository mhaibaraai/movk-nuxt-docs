import type { ContentNavigationItem } from '@nuxt/content'
import type { Category } from './nav-config'

function findNode(items: ContentNavigationItem[], path: string): ContentNavigationItem | undefined {
  for (const item of items) {
    if (item.path === path) return item
    const found = item.children && findNode(item.children, path)
    if (found) return found
  }
}

/**
 * 将任意 locale 的导航树归一化为以 docsRoot 为根的单节点结构，
 * 使下游 useNavigation 的处理逻辑在中英文下保持一致。
 *
 * - 命中 docsRoot 节点（默认语言的 `/docs`、非默认语言折叠后的 `/{locale}/docs`
 *   或多层嵌套的 `/{locale}` -> `/{locale}/docs`）：返回该节点。
 * - 未命中（@nuxt/content 折叠掉了 docsRoot 包裹层，顶层直接是各 section）：
 *   合成包裹层，把顶层 section 包进 docsRoot。
 */
export function transformNavigation(
  data: ContentNavigationItem[] | null | undefined,
  docsRoot: string
): ContentNavigationItem[] {
  if (!data?.length) return []

  const node = findNode(data, docsRoot)
  // 合成的包裹节点仅用于让 rootNavigation 取到 [0].children，title 不会被渲染
  return node ? [node] : [{ path: docsRoot, title: '', children: data }]
}

export interface GroupByCategoryOptions {
  /** 当前栏目，即 `docs.categories` 的键 */
  slug: string
  docsRoot: string
  overviewTitle: string
  categories: Record<string, Category[]>
}

/**
 * 侧栏分组：无分类或分类未在 `docs.categories` 声明的页面归入概览，
 * 带子节点的目录原样保留，其余按声明顺序分组。
 */
export function groupByCategory(items: ContentNavigationItem[], options: GroupByCategoryOptions): ContentNavigationItem[] {
  const { slug, docsRoot, overviewTitle, categories } = options
  const sectionPath = `${docsRoot}/${slug}`
  const declared = categories[slug] ?? []
  const declaredIds = new Set(declared.map(category => category.id))

  const overview = items.filter(item => !item.children?.length && !declaredIds.has(item.category as string))
  const folders = items.filter(item => item.children?.length && !declaredIds.has(item.category as string))

  const categorized = declared
    .map(category => ({
      title: category.title,
      path: sectionPath,
      icon: category.icon,
      children: items.filter(item => item.category === category.id)
    }))
    .filter(group => group.children.length)

  return [
    ...(overview.length ? [{ title: overviewTitle, path: sectionPath, icon: 'i-lucide-house', children: overview }] : []),
    ...folders,
    ...categorized
  ]
}

/** 页面 frontmatter 中使用但未在 `docs.categories` 声明的分类 */
export function undeclaredCategories(items: ContentNavigationItem[], declared: Category[]): string[] {
  const ids = new Set(declared.map(category => category.id))
  return [...new Set(items.map(item => item.category as string | undefined).filter((id): id is string => !!id && !ids.has(id)))]
}

/** 栏目链接：目录没有首页（`page: false`）时指向其中第一篇页面 */
export function sectionLink(item: ContentNavigationItem): string {
  if (item.page !== false) return item.path
  for (const child of item.children ?? []) {
    const link = sectionLink(child)
    if (link !== child.path || child.page !== false) return link
  }
  return item.path
}

/** 面包屑链接：没有首页的目录与栏目链接保持一致，避免指向不存在的页面 */
export function breadcrumbLinks(items: ContentNavigationItem[]): { label: string, to: string }[] {
  return items.map(item => ({ label: item.title, to: sectionLink(item) }))
}
