import type { ContentNavigationItem } from '@nuxt/content'
import { findPageBreadcrumb, findPageChildren } from '@nuxt/content/utils'
import { breadcrumbLinks, groupByCategory, undeclaredCategories } from '../utils/navigation'

function processNavigationItem(item: ContentNavigationItem, parent?: ContentNavigationItem): ContentNavigationItem | ContentNavigationItem[] {
  return {
    ...item,
    title: parent?.title ? parent.title : item.title,
    children: item.children?.length ? item.children?.flatMap(child => processNavigationItem(child)) : undefined
  }
}

export function useNavigation(navigation: Ref<ContentNavigationItem[] | undefined>) {
  const route = useRoute()
  const { docsRoot, t } = useMovkI18n()
  const { categories } = useCategory()

  const rootNavigation = computed(() =>
    navigation.value?.[0]?.children?.map(item => processNavigationItem(item)) as ContentNavigationItem[]
  )

  const navigationByCategory = computed(() => {
    const root = navigation?.value
    if (!root?.length) return []

    // 切换语言时数据与 locale 短暂不一致：避免用其他 locale 的导航树渲染当前路由
    if (!root.some(item => item.path?.startsWith(docsRoot.value))) return []

    const slug = route.params.slug?.[0] as string
    const children = findPageChildren(root, `${docsRoot.value}/${slug}`, { indexAsChild: true })

    if (import.meta.dev) {
      const missing = undeclaredCategories(children, categories.value[slug] ?? [])
      if (missing.length) {
        console.warn(`[movk-nuxt-docs] 栏目 "${slug}" 的页面使用了未在 app.config docs.categories 中声明的分类：${missing.join(', ')}，已归入概览分组`)
      }
    }

    return groupByCategory(children, { slug, docsRoot: docsRoot.value, overviewTitle: t('docs.overview'), categories: categories.value })
  })

  function findBreadcrumb(path: string) {
    return breadcrumbLinks(findPageBreadcrumb(navigation?.value, path, { indexAsChild: true }))
  }

  return {
    rootNavigation,
    navigationByCategory,
    findBreadcrumb
  }
}
