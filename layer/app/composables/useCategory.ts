import { resolveCategories } from '../utils/nav-config'

/** 读取 app.config 的 docs.categories，用于侧边栏按分类分组 */
export function useCategory() {
  const appConfig = useAppConfig()
  const { locale, defaultLocale } = useMovkI18n()

  const categories = computed(() => resolveCategories(appConfig.docs?.categories, locale.value, defaultLocale))

  return {
    categories
  }
}
