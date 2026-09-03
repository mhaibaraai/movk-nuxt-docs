import { getAgentDocument, getAgentSiteUrl, renderAgentResources } from '#agent-discovery'

interface SeoConfig {
  title?: string
  description?: string
}

interface GithubConfig {
  url?: string
}

/**
 * 首页的 markdown 表示。
 *
 * nuxt-agent-discovery 默认把 `/` 当作普通文档，直接输出 landing 页的 MDC 树；
 * 那是一堆组件标记，对 agent 的价值远低于一份导航性摘要。模块显式支持站点
 * 自带 `/raw/index.md` 处理器来接管这份文档，发现清单仍由 renderAgentResources
 * 从同一份注册表渲染。
 */
export default defineCachedEventHandler(async (event) => {
  const appConfig = useAppConfig()
  const seo = (appConfig.seo || {}) as SeoConfig
  const github = appConfig.github as GithubConfig | false | undefined
  const siteUrl = getAgentSiteUrl(event)

  // 标题与简介取自内容适配器，locale 集合与 landing 集合的探测都归它管
  const landing = await getAgentDocument(event, '/')
  const page = landing && !('redirect' in landing) ? landing : undefined
  const title = page?.title || seo.title || 'Documentation'
  const description = page?.description || seo.description || ''

  const links = [
    `- Website: <${siteUrl}>`,
    github && github.url ? `- GitHub: <${github.url}>` : undefined
  ].filter(Boolean).join('\n')

  const body = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `canonical_url: ${JSON.stringify(siteUrl)}`,
    '---',
    '',
    `# ${title}`,
    '',
    ...(description ? [`> ${description}`, ''] : []),
    ...(description ? ['## About', '', description, ''] : []),
    renderAgentResources(event),
    '## Links',
    '',
    links,
    ''
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setResponseHeader(event, 'Vary', 'Accept, User-Agent')
  setResponseHeader(event, 'Link', [
    `<${siteUrl}>; rel="canonical"`,
    `<${siteUrl}>; rel="alternate"; type="text/html"`
  ].join(', '))

  return body
}, {
  swr: true,
  maxAge: 60 * 60
})
