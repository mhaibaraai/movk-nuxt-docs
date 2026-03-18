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
    colors: {
      primary: 'green',
      neutral: 'slate'
    }

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
      clearChat: '清除聊天记录',
      close: '关闭',
      placeholder: '输入你的问题...',
      lineBreak: '换行',
      trigger: '与 AI 聊天',
      explainWithAi: '用 AI 解释此页面'
    },
    icons: {
      trigger: 'i-custom-ai',
      explain: 'i-lucide-bot-message-square',
      reasoning: 'i-lucide-brain',
      close: 'i-lucide-panel-right-close',
      clearChat: 'i-lucide-list-x',
      providers: {
        deepseek: 'i-hugeicons:deepseek',
        alibaba: 'i-hugeicons:qwen',
        zai: 'i-simple-icons:zig',
        moonshotai: 'i-hugeicons:kimi-ai',
        xai: 'i-hugeicons:grok-02'
      }
    }
  }
})
