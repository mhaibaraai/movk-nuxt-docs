/** 单一文案或按语言代码区分的文案 */
export type LocalizedText = string | Record<string, string>

export interface NavLinkConfig {
  label: LocalizedText
  to: string
  icon?: string
  target?: '_blank' | '_self'
  /** 激活判断所用的路径前缀，默认取 to */
  activeMatch?: string
  /** 显式指定激活状态，优先于前缀判断 */
  active?: boolean
}

export interface NavLink {
  label: string
  to: string
  icon?: string
  target?: '_blank' | '_self'
  active: boolean
}

export interface CategoryConfig {
  id: string
  title: LocalizedText
  icon: string
}

export interface Category {
  id: string
  title: string
  icon: string
}

export interface NavContext {
  locale: string
  defaultLocale: string
  /** 当前路由路径 */
  path: string
  localePath: (path: string) => string
}

export function resolveLocalized(text: LocalizedText | undefined, locale: string, defaultLocale: string): string {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[locale] ?? text[defaultLocale] ?? Object.values(text)[0] ?? ''
}

const isExternal = (to: string) => /^[a-z][\w+.-]*:/i.test(to)

export function resolveNavLinks(items: readonly NavLinkConfig[], context: NavContext): NavLink[] {
  return items.map(({ label, to, icon, target, activeMatch, active }) => {
    const external = isExternal(to)
    const link: NavLink = {
      label: resolveLocalized(label, context.locale, context.defaultLocale),
      to: external ? to : context.localePath(to),
      active: active ?? (!external && context.path.startsWith(context.localePath(activeMatch ?? to)))
    }
    if (icon) link.icon = icon
    if (target ?? (external ? '_blank' : undefined)) link.target = target ?? '_blank'
    return link
  })
}

export function resolveCategories(
  categories: Readonly<Record<string, readonly CategoryConfig[]>> | undefined,
  locale: string,
  defaultLocale: string
): Record<string, Category[]> {
  return Object.fromEntries(Object.entries(categories ?? {}).map(([section, items]) => [
    section,
    items.map(({ id, title, icon }) => ({ id, title: resolveLocalized(title, locale, defaultLocale), icon }))
  ]))
}
