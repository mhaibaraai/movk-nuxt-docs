import type { ContentNavigationItem } from '@nuxt/content'

/** 导航与页头所需的版本信息，对应 /api/github/releases.json 的列表项 */
export interface ReleaseSummary {
  tag: string
  title: string
  date: string
  url: string
  prerelease: boolean
}

export interface ReleasesFilter {
  /** 是否包含预发布版本 */
  prerelease?: boolean
  /** tag 需匹配的正则 */
  include?: string
}

export const RELEASES_ROOT = '/releases'

/** 按 releases 内容文件的配置筛选出在导航中列出的版本 */
export function filterReleases(releases: ReleaseSummary[], { prerelease = false, include }: ReleasesFilter = {}): ReleaseSummary[] {
  const pattern = include ? new RegExp(include) : null
  return releases.filter(release => (prerelease || !release.prerelease) && (!pattern || pattern.test(release.tag)))
}

/** 最新版本位于根路径，其余版本位于各自的 tag 下 */
export function releasePath(releases: ReleaseSummary[], tag: string): string {
  return tag === releases[0]?.tag ? RELEASES_ROOT : `${RELEASES_ROOT}/${tag}`
}

/** 按主版本号分组的版本导航 */
export function releasesNavigation(releases: ReleaseSummary[], localePath: (path: string) => string): ContentNavigationItem[] {
  const groups = new Map<string, ContentNavigationItem[]>()

  for (const release of releases) {
    const major = release.tag.match(/^v?(\d+)\./)?.[1]
    const key = major ? `v${major}.x` : release.tag
    const path = localePath(releasePath(releases, release.tag))
    const items = groups.get(key) ?? []
    // 最新版本位于根路径，不设 exact 时它会作为其他版本的父级一直高亮
    groups.set(key, [...items, { title: release.tag, path, exact: path === localePath(RELEASES_ROOT) } as ContentNavigationItem])
  }

  return [...groups].map(([title, children]) => ({ title, path: children[0]!.path, children }))
}

interface MdcNode {
  type: string
  tag?: string
  children?: MdcNode[]
  [key: string]: unknown
}

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

/**
 * 解开标题内的链接（如 changelog 生成的 `## [2.2.0](compare-url)`）：ProseH2 等会把标题包进锚点，
 * 嵌套的 `<a>` 在服务端输出后会被浏览器拆开，导致水合不匹配
 */
export function unwrapHeadingLinks<T extends MdcNode>(node: T, inHeading = false): T {
  const insideHeading = inHeading || (node.type === 'element' && HEADING_TAGS.has(node.tag ?? ''))
  if (!node.children) {
    return node
  }

  const children = node.children.flatMap((child) => {
    const next = unwrapHeadingLinks(child, insideHeading)
    return insideHeading && next.type === 'element' && next.tag === 'a' ? next.children ?? [] : [next]
  })

  return { ...node, children }
}

const PROTECTED = /```[\s\S]*?```|`[^`\n]+`|<\/?[a-z][^>]*>|\[[^\]]*\]\([^)]*\)/gi
const MENTION = /(^|[^\w`/])@([a-z\d](?:[a-z\d-]{0,37}[a-z\d])?)\b(?![\w-]*\/)/gi
// 大写开头的标签（如 `<PROVIDER>_BASE_URL`）在 GitHub 上是未知 HTML 而被丢弃，MDC 却会当作 Vue 组件解析
const COMPONENT_TAG = /^<\/?[A-Z]/

/**
 * 把 GitHub 发布说明转为可安全交给 MDC 的 Markdown：
 * @用户名 转为 GitHub 链接（API 返回的是纯文本），大写开头的类标签文本转义，代码、HTML 与已有链接保持原样
 */
export function prepareReleaseNotes(markdown: string): string {
  const link = (text: string) => text.replace(MENTION, (_, before: string, name: string) => `${before}[@${name}](https://github.com/${name})`)

  let result = ''
  let index = 0
  for (const match of markdown.matchAll(PROTECTED)) {
    const token = COMPONENT_TAG.test(match[0]) ? match[0].replace('<', '&lt;') : match[0]
    result += link(markdown.slice(index, match.index)) + token
    index = match.index + match[0].length
  }

  return result + link(markdown.slice(index))
}
