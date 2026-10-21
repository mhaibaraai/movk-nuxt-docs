import type { ContentNavigationItem } from '@nuxt/content'
import type { Ref } from 'vue'
import * as nuxtUiLocales from '@nuxt/ui/locale'

// 保留字符串 key：v2 中覆盖了 Header 等组件的使用方直接 inject('navigation')
const NAVIGATION_KEY = 'navigation'

/**
 * app.vue 与 error.vue 共用的外壳：语言、导航、搜索索引与基础 head。
 * provide / useHead 依赖组件实例，必须在函数内唯一的 await 之前完成注册
 */
export async function useDocsShell() {
  const { locale, docsRoot, docsCollection } = useMovkI18n()
  const { style, color } = useTheme()

  const nuxtUiLocale = computed(() =>
    nuxtUiLocales[locale.value.replace('-', '_').toLowerCase() as keyof typeof nuxtUiLocales] || nuxtUiLocales.en
  )

  const navigationRequest = useAsyncData(
    () => `docs-navigation-${locale.value}`,
    () => queryCollectionNavigation(docsCollection.value as 'docs', ['category', 'description']),
    {
      transform: data => transformNavigation(data, docsRoot.value)
    }
  )

  const { data: files } = useLazyAsyncData(
    () => `docs-search-${locale.value}`,
    () => queryCollectionSearchSections(docsCollection.value as 'docs', { ignoredTags: ['style'] }),
    { server: false }
  )

  useHead({
    htmlAttrs: {
      lang: computed(() => nuxtUiLocale.value.code),
      dir: computed(() => nuxtUiLocale.value.dir)
    },
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { key: 'theme-color', name: 'theme-color', content: color }
    ],
    style
  })

  const { rootNavigation } = useNavigation(navigationRequest.data)
  provide(NAVIGATION_KEY, rootNavigation)

  await navigationRequest

  return {
    nuxtUiLocale,
    rootNavigation,
    files
  }
}

/** 读取外壳提供的文档导航树 */
export function useDocsNavigation(): Ref<ContentNavigationItem[] | undefined> {
  return inject<Ref<ContentNavigationItem[] | undefined>>(NAVIGATION_KEY, ref(undefined))
}
