export interface RecentPage {
  path: string
  title: string
}

/** 记录一次访问：去重后置顶，超出上限时丢弃最旧的记录 */
export function pushRecentPage(list: readonly RecentPage[], page: RecentPage, max = 6): RecentPage[] {
  return [page, ...list.filter(item => item.path !== page.path)].slice(0, max)
}
