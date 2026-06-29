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
    faqQuestions: {
      'zh-CN': [
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
            '如何启用多语言？',
            '哪些依赖需要手动装？'
          ]
        },
        {
          category: '内容与组件',
          items: [
            '内容放哪，路由怎么生成？',
            '多语言内容目录怎么组织？',
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
      ],
      'en': [
        {
          category: 'Overview',
          items: [
            'What kind of docs site is it for?',
            'What do layer, docs, and templates do?',
            'Templates vs. the npm package?',
            'What capabilities are built in?'
          ]
        },
        {
          category: 'Setup & Configuration',
          items: [
            'How do I create a docs site from scratch?',
            'How do I add the layer to an existing project?',
            'How do app.config and nuxt.config differ?',
            'How do I enable multiple languages?',
            'Which dependencies must I install manually?'
          ]
        },
        {
          category: 'Content & Components',
          items: [
            'Where does content go and how are routes generated?',
            'How do I organize multilingual content directories?',
            'How do I use MDC components?',
            'How do I auto-generate component docs?',
            'How do I show examples and commit history?'
          ]
        },
        {
          category: 'AI & Release',
          items: [
            'How do I enable AI Chat?',
            'What can the MCP Server do?',
            'What are llms.txt and Skills for?',
            'What should I check before deploying?'
          ]
        }
      ]
    }
  }
})
