interface SeoConfig {
  title?: string
  description?: string
}

interface GithubConfig {
  url?: string
}

/**
 * nuxt-agent-discovery 无从得知的部分。
 *
 * `agent-discovery:document` 在 minimark 树被 stringify 成 /raw/**.md 之前把
 * 文档里的 MDC 组件转成纯 markdown，也就是原先 raw 路由自己调用 transformMDC 的位置。
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('agent-discovery:document', async (event, page) => {
    await transformMDC(event, page)
  })

  // 服务卡片的静态半边只能声明 layer 已知的字段：站点名、版本、仓库都来自消费方，
  // 与 appConfig / runtimeConfig 一样在请求期才成型。工具、资源、提示词清单由模块
  // 从 @nuxtjs/mcp-toolkit 读取，这里只补 serverInfo。
  nitroApp.hooks.hook('agent-discovery:mcp-server-card', (event, card) => {
    const appConfig = useAppConfig()
    const seo = (appConfig.seo || {}) as SeoConfig
    const github = appConfig.github as GithubConfig | false | undefined
    const siteName = getSiteConfig(event).name || seo.title || 'Documentation'
    const version = useRuntimeConfig(event).public.version

    card.serverInfo = {
      ...(card.serverInfo as Record<string, unknown>),
      name: siteName,
      title: `${siteName} MCP Server`,
      description: seo.description || `MCP server for the ${siteName} documentation site.`,
      ...(version ? { version } : {}),
      ...(github && github.url ? { repository: github.url } : {})
    }
  })
})
