import { computed, type ComputedRef } from 'vue'

/**
 * 当前路由是否为文档子页面，兼容多语言前缀（/docs/* 或 /{locale}/docs/*）。
 */
export function useDocsRoute(): ComputedRef<boolean> {
  const route = useRoute()
  const { docsRoot } = useMovkI18n()

  return computed(() => route.path.startsWith(`${docsRoot.value}/`))
}
