import type { ContentNavigationItem } from '@nuxt/content'

interface DocsFilterConfig {
  enabled: ComputedRef<boolean>
  placeholder: ComputedRef<string>
  threshold: ComputedRef<number>
  shortcut: ComputedRef<string>
}

const DEFAULTS = {
  enabled: false,
  threshold: 10,
  shortcut: '/'
}

type ScoreItem = (item: ContentNavigationItem, term: string, fields: string[]) => unknown

export function useDocsFilterConfig(): DocsFilterConfig {
  const appConfig = useAppConfig()
  const { t } = useMovkI18n()

  return {
    enabled: computed(() => appConfig.aside?.filter?.enabled ?? DEFAULTS.enabled),
    placeholder: computed(() => appConfig.aside?.filter?.placeholder || t('docs.filterPlaceholder')),
    threshold: computed(() => appConfig.aside?.filter?.threshold ?? DEFAULTS.threshold),
    shortcut: computed(() => appConfig.aside?.filter?.shortcut ?? DEFAULTS.shortcut)
  }
}

export function useDocsFilterVisible(): ComputedRef<boolean> {
  const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
  const { navigationByCategory } = useNavigation(navigation!)
  const { enabled, threshold } = useDocsFilterConfig()

  return computed(() => {
    if (!enabled.value) return false

    const itemTotal = navigationByCategory.value.reduce(
      (total, group) => total + (group.children?.length ?? 0),
      0
    )

    return itemTotal >= threshold.value
  })
}

function filterItems(
  items: ContentNavigationItem[],
  term: string,
  scoreItem: ScoreItem
): ContentNavigationItem[] {
  return items.reduce<ContentNavigationItem[]>((acc, item) => {
    if (scoreItem(item, term, ['title', 'description']) !== null) {
      acc.push(item)
    } else if (item.children?.length) {
      const children = filterItems(item.children, term, scoreItem)
      if (children.length) acc.push({ ...item, children })
    }

    return acc
  }, [])
}

export function filterNavigation(
  groups: ContentNavigationItem[],
  term: string,
  scoreItem: ScoreItem
): ContentNavigationItem[] {
  if (!term) return groups

  return groups
    .map(group => ({
      ...group,
      children: group.children ? filterItems(group.children, term, scoreItem) : []
    }))
    .filter(group => group.children.length > 0)
}
