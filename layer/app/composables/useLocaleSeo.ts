import { joinURL } from 'ufo'
import { computed } from 'vue'

/**
 * 多语言 SEO：为每个 locale 注入 hreflang alternate 与 x-default，并设置 og:locale。
 * 仅在启用 @nuxtjs/i18n 且存在多个有效 locale 时生效。
 */
export function useLocaleSeo(): void {
  const { isEnabled, locale, locales, switchLocalePath } = useMovkI18n()

  if (!isEnabled || locales.length < 2) return

  const site = useSiteConfig()

  useSeoMeta({
    ogLocale: () => locale.value.replace('-', '_')
  })

  useHead({
    link: computed(() => {
      const links: Array<{ rel: string, hreflang?: string, href: string }> = []

      for (const item of locales) {
        const path = switchLocalePath(item.code)
        if (path) {
          links.push({ rel: 'alternate', hreflang: item.code, href: joinURL(site.url, path) })
        }
      }

      const fallback = switchLocalePath(locales[0]!.code)
      if (fallback) {
        links.push({ rel: 'alternate', hreflang: 'x-default', href: joinURL(site.url, fallback) })
      }

      return links
    })
  })
}
