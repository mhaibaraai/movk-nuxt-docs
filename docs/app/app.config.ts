export default defineAppConfig({
  vercelAnalytics: {
    enable: true,
    debug: false
  },
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
        category: '基础使用',
        items: [
          '什么是 Movk Nuxt Docs？',
          '如何安装并创建文档站点？',
          '如何作为 Layer 集成到现有项目？',
          '如何自定义主题和导航？'
        ]
      },
      {
        category: '文档编写',
        items: [
          '如何使用 MDC 语法？',
          '如何自动生成组件文档？',
          '如何展示 Git 提交历史？',
          '如何配置 SEO 和 OG 图片？'
        ]
      },
      {
        category: 'AI 集成',
        items: [
          '什么是 LLMs.txt？有什么作用？',
          '如何启用 AI Chat 助手？',
          '如何配置 MCP Server？',
          '支持哪些 AI 模型？'
        ]
      }
    ]
  }
})
