export default defineAppConfig({
  aside: {
    filter: {
      enabled: true
    }
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
        category: '模块定位',
        items: [
          '适合搭建什么文档站？',
          'Layer、docs、templates 的职责？',
          '模板与安装包的区别？',
          '内置了哪些能力？'
        ]
      },
      {
        category: '安装与配置',
        items: [
          '如何从零创建文档站？',
          '已有项目如何接入 Layer？',
          'app.config 和 nuxt.config 怎么配？',
          '哪些依赖需要手动装？'
        ]
      },
      {
        category: '内容与组件',
        items: [
          '内容放哪，路由怎么生成？',
          '如何使用 MDC 组件？',
          '如何自动生成组件文档？',
          '如何展示示例与提交历史？'
        ]
      },
      {
        category: 'AI 与发布',
        items: [
          '如何启用 AI Chat？',
          'MCP Server 能做什么？',
          'llms.txt 和 Skills 有何用？',
          '部署前要检查什么？'
        ]
      }
    ]
  }
})
