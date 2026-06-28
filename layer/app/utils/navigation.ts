import type { ContentNavigationItem } from '@nuxt/content'

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
