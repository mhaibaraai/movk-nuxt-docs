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
        category: '入门指南',
        items: [
          'Movk Nuxt Docs 是什么？',
          '如何快速创建文档站点？',
          '完整模板和模块模板有什么区别？',
          '如何作为 Layer 集成到现有项目？'
        ]
      },
      {
        category: '内容编写',
        items: [
          '如何使用 MDC 语法？',
          '支持哪些 Markdown 扩展功能？',
          '如何在文档中嵌入 Vue 组件？',
          '代码块如何添加高亮和行号？'
        ]
      },
      {
        category: '配置定制',
        items: [
          '如何配置站点 SEO？',
          '如何自定义头部和页脚？',
          '如何集成 GitHub 仓库？',
          '如何配置侧边栏导航？'
        ]
      },
      {
        category: '组件文档',
        items: [
          '如何自动生成组件文档？',
          '如何展示组件交互示例？',
          '如何显示 Git 提交历史？',
          'CommitChangelog 组件如何使用？'
        ]
      },
      {
        category: 'AI 功能',
        items: [
          '什么是 LLMs.txt？',
          '如何配置 MCP Server？',
          'AI Chat 功能如何启用？',
          '如何自定义 AI 助手行为？'
        ]
      },
      {
        category: '高级功能',
        items: [
          '如何部署文档站点？',
          '支持哪些静态托管平台？',
          '如何集成分析工具？',
          '如何自定义主题样式？'
        ]
      }
    ]
  }
})
