import type { Link } from '@unhead/vue'
import { parseURL } from 'ufo'
import { computed } from 'vue'

/**
 * 多语言 SEO：为每个 locale 注入 hreflang alternate 与 x-default，并设置 og:locale。
 * hreflang 仅在启用 @nuxtjs/i18n 且存在多个有效 locale 时设置。
 */
export function useLocaleSeo(): void {
  const { isEnabled, locale, locales, defaultLocale, switchLocalePath } = useMovkI18n()
  const language = (code: string) => locales.find(item => item.code === code)?.language || code

  useSeoMeta({
    ogLocale: () => {
      const [, languageCode, region] = /^([a-z]{2,3})(?:-[a-z]{4})?-([a-z]{2}|\d{3})$/i.exec(language(locale.value)) ?? []
      return languageCode && region ? `${languageCode.toLowerCase()}_${region.toUpperCase()}` : undefined
    }
  })

  if (!isEnabled || locales.length < 2) return

  const sitePath = createSitePathResolver({ absolute: true, withBase: true })

  useHead({
    link: computed(() => {
      const links: Link[] = []
      let fallback: string | undefined

      for (const item of locales) {
        const path = switchLocalePath(item.code)
        if (!path) continue

        const href = sitePath(parseURL(path).pathname).value
        links.push({ rel: 'alternate', hreflang: language(item.code), href })
        if (item.code === defaultLocale) fallback = href
      }

      if (fallback) links.push({ rel: 'alternate', hreflang: 'x-default', href: fallback })

      return links
    })
  })
}
