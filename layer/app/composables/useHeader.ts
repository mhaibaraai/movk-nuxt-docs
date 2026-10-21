import type { NavLinkConfig } from '../utils/nav-config'
import { resolveNavLinks } from '../utils/nav-config'

/** 读取 app.config 的 header.nav / header.mobileNav，未配置 mobileNav 时沿用 nav */
export function useHeader() {
  const appConfig = useAppConfig()
  const route = useRoute()
  const { locale, defaultLocale, localePath } = useMovkI18n()

  const resolve = (items: readonly NavLinkConfig[] | undefined) => resolveNavLinks(items ?? [], {
    locale: locale.value,
    defaultLocale,
    path: route.path,
    localePath
  })

  const desktopLinks = computed(() => resolve(appConfig.header?.nav))
  const mobileLinks = computed(() => resolve(appConfig.header?.mobileNav?.length ? appConfig.header.mobileNav : appConfig.header?.nav))

  return {
    desktopLinks,
    mobileLinks
  }
}
