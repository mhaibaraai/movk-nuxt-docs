import type { ExtendedButtonProps } from './types'

export default defineAppConfig({
  i18n: {
    locale: 'zh-CN'
  },
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
    font: 'Alibaba PuHuiTi'
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  },
  header: {
    avatar: 'https://docs.mhaibaraai.cn/avatar.png',
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
    bottom: {
      links: [] as ExtendedButtonProps[]
    }
  },
  aside: {
    filter: {
      enabled: false,
      threshold: 10,
      shortcut: '/'
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
    icons: {
      trigger: 'i-custom-ai',
      explain: 'i-lucide-bot-message-square',
      reasoning: 'i-lucide-brain',
      close: 'i-lucide-panel-right-close',
      clearChat: 'i-lucide-list-x',
      providers: {
        openai: 'i-simple-icons-openai',
        anthropic: 'i-simple-icons-anthropic',
        deepseek: 'i-hugeicons-deepseek',
        alibaba: 'i-hugeicons-qwen',
        zai: 'i-custom-zai',
        moonshotai: 'i-hugeicons-kimi-ai',
        xai: 'i-hugeicons-grok-02'
      }
    }
  }
})
