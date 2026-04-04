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
        category: '5 分钟上手',
        items: [
          '能帮我写一个最小化的安装步骤吗？',
          'Layer 和直接复制模板有什么本质区别？',
          '从零搭建一个类似 Nuxt UI 风格的文档站需要哪些步骤？',
          '我有现成的 Nuxt 项目，怎么最快速地接入文档系统？'
        ]
      },
      {
        category: '内容魔法',
        items: [
          'MDC 语法比普通 Markdown 强在哪里？',
          '能在文档里嵌入真实可交互的 Vue 组件吗？',
          '组件 Props 文档能自动同步，不用手动维护吗？',
          '如何优雅地在文档里展示代码的 Git 变更历史？',
          '如何在文档中使用 Mermaid 图表？'
        ]
      },
      {
        category: 'AI 超能力',
        items: [
          'AI Chat 是怎么「读懂」我整个文档站的？',
          'MCP Server 能做什么普通 AI 对话做不到的事？',
          'llms.txt 和 RAG 检索有什么关系？',
          '如何让 Cursor、Claude 这类工具直接理解我的文档？',
          '帮我写一个用于代码审查的 Agent Skill'
        ]
      },
      {
        category: '进阶定制',
        items: [
          '如何打造完全不同于默认风格的品牌文档？',
          'Tailwind CSS 4 的新特性在这里怎么用？',
          '能扩展 MCP 工具，给 AI 更多访问文档的能力吗？',
          '支持多语言国际化文档站吗？'
        ]
      }
    ]
  }
})
