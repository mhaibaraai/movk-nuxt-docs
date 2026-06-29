import type { ContentNavigationItem } from '@nuxt/content'
import { findPageBreadcrumb, findPageChildren } from '@nuxt/content/utils'
import { mapContentNavigation } from '@nuxt/ui/utils/content'

type Translate = (key: string, params?: Record<string, string | number>) => string
type Categories = Record<string, { id: string, title: string, icon: string }[]>

function groupChildrenByCategory(items: ContentNavigationItem[], slug: string, docsRoot: string, t: Translate, categories: Categories): ContentNavigationItem[] {
  if (!items.length) return []

  const groups: ContentNavigationItem[] = []

  const categorizedMap = new Map<string, ContentNavigationItem[]>()
  const withChildren: ContentNavigationItem[] = []
  const withoutChildren: ContentNavigationItem[] = []

  for (const item of items) {
    if (item.category) {
      const key = item.category as string
      if (!categorizedMap.has(key)) {
        categorizedMap.set(key, [])
      }
      categorizedMap.get(key)!.push(item)
    } else if (item.children?.length) {
      withChildren.push(item)
    } else {
      withoutChildren.push(item)
    }
  }

  if (withoutChildren.length) {
    groups.push({
      title: t('docs.overview'),
      path: `${docsRoot}/${slug}`,
      icon: 'i-lucide-house',
      children: withoutChildren
    })
  }

  groups.push(...withChildren)

  const categoryList = categories[slug as keyof typeof categories] ?? []
  for (const category of categoryList) {
    const children = categorizedMap.get(category.id)
    if (children?.length) {
      groups.push({
        title: category.title,
        path: `${docsRoot}/${slug}`,
        icon: category.icon,
        children
      })
    }
  }

  return groups
}

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

    return groupChildrenByCategory(children, slug, docsRoot.value, t, toValue(categories))
  })

  function findBreadcrumb(path: string) {
    const breadcrumb = findPageBreadcrumb(navigation?.value, path, { indexAsChild: true })

    return mapContentNavigation(breadcrumb).map(({ icon, ...link }) => link)
  }

  return {
    rootNavigation,
    navigationByCategory,
    findBreadcrumb
  }
}
