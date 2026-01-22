import type { ExtendedButtonProps } from './types'

export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    duration: 5000,
    max: 5,
    expand: true
  },
  theme: {
    radius: 0.25,
    blackAsPrimary: false,
    icons: 'lucide',
    font: 'Public Sans'
  },
  ui: {
    prose: {
      codeIcon: {
        mmd: 'i-vscode-icons-file-type-mermaid'
      }
    },
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    contentNavigation: {
      slots: {
        linkLeadingIcon: 'size-4 mr-1',
        linkTrailing: 'hidden'
      },
      defaultVariants: {
        variant: 'link'
      }
    },
    pageLinks: {
      slots: {
        linkLeadingIcon: 'size-4',
        linkLabelExternalIcon: 'size-2.5'
      }
    }
  },
  vercelAnalytics: {
    enable: false,
    debug: false
  },
  header: {
    avatar: 'https://docs.mhaibaraai.cn/avatar.png',
    title: 'Movk Nuxt Docs',
    to: '/',
    search: true,
    colorMode: true,
    links: [] as ExtendedButtonProps[]
  },
  footer: {
    credits: `Copyright © 2024 - ${new Date().getFullYear()}`,
    socials: [] as ExtendedButtonProps[]
  },
  toc: {
    title: '页面导航',
    bottom: {
      title: '社区',
      links: [] as ExtendedButtonProps[]
    }
  },
  github: {
    rootDir: '',
    dateFormat: {
      locale: 'zh-CN',
      options: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Shanghai'
      }
    }
  },
  aiChat: {
    floatingInput: true,
    explainWithAi: true,
    shortcuts: {
      focusInput: 'meta_i'
    },
    texts: {
      title: 'AI 助手',
      collapse: '折叠',
      expand: '展开',
      clearChat: '清除聊天记录',
      close: '关闭',
      loading: 'Loading...',
      askAnything: '问我任何事情...',
      askMeAnythingDescription: '我可以帮助您浏览文档、解释概念并回答您的问题。',
      faq: 'FAQ 建议',
      placeholder: '输入你的问题...',
      lineBreak: '换行',
      trigger: '与 AI 聊天',
      streaming: '思考中...',
      streamed: '思考过程',
      explainWithAi: '用 AI 解释此页面'
    },
    icons: {
      loading: 'i-lucide-loader',
      trigger: 'i-lucide-sparkles',
      explain: 'i-lucide-brain',
      close: 'i-lucide-x',
      clearChat: 'i-lucide-trash-2',
      streaming: 'i-lucide-chevron-down',
      providers: {
        mistral: 'i-simple-icons-mistralai',
        kwaipilot: 'i-lucide-wand'
      }
    }
  }
})
