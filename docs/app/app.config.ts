export default defineAppConfig({
  github: {
    rootDir: 'docs',
    commitPath: 'layer/app/components/content',
    since: '2025-06-31T04:00:00Z'
  },
  toc: {
    bottom: {
      links: [
        {
          icon: 'i-lucide-message-circle-code',
          to: 'https://docs.mhaibaraai.cn/llms.txt',
          target: '_blank',
          label: 'Open LLMs'
        }
      ]
    }
  },
  footer: {
    socials: [
      {
        'icon': 'i-simple-icons-nuxt',
        'to': 'https://nuxt.com/',
        'target': '_blank',
        'aria-label': 'Nuxt Website'
      },
      {
        'icon': 'i-lucide-mail',
        'to': 'mailto:mhaibaraai@gmail.com',
        'target': '_blank',
        'aria-label': 'YiXuan\'s Gmail'
      }
    ]
  },
  aiChat: {
    faqQuestions: [
      {
        category: '模块定位',
        items: [
          '@movk/nuxt-docs 适合用来搭建什么类型的文档站？',
          'Nuxt Layer、docs 站点和 templates 分别承担什么职责？',
          '直接使用模板和安装 @movk/nuxt-docs 有什么区别？',
          '这个模块库内置了哪些文档、组件和 AI 能力？'
        ]
      },
      {
        category: '安装与配置',
        items: [
          '如何从零创建一个基于 @movk/nuxt-docs 的文档站？',
          '已有 Nuxt 4 项目如何接入这个文档 Layer？',
          'app.config.ts 和 nuxt.config.ts 分别应该配置什么？',
          'better-sqlite3、tailwindcss、mermaid 这些依赖什么时候需要安装？'
        ]
      },
      {
        category: '内容与组件',
        items: [
          '文档内容应该放在哪个目录，路由是如何生成的？',
          '如何在 Markdown 中使用 MDC 组件和代码块？',
          '如何自动生成组件 props、slots 和 emits 文档？',
          '如何展示组件示例代码、提交历史和最后更新时间？'
        ]
      },
      {
        category: 'AI 与发布',
        items: [
          '如何启用 AI Chat，需要配置哪些环境变量？',
          '内置 MCP Server 能让 Cursor、Claude 或 ChatGPT 做什么？',
          'llms.txt 和 Skills 如何帮助 AI 理解文档站？',
          '部署到生产环境前需要检查哪些配置？'
        ]
      }
    ]
  }
})
