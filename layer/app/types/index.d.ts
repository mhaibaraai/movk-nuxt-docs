import type { ButtonProps } from '@nuxt/ui'

export interface ExtendedButtonProps extends ButtonProps {
  label?: string
}

declare module 'nuxt/schema' {
  interface AppConfig {
    vercelAnalytics: {
      enable: boolean
      debug: boolean
    }
    seo: {
      titleTemplate: string
      title: string
      description: string
    }
    header: {
      title: string
      avatar: string
      to: string
      search: boolean
      colorMode: boolean
      links: ExtendedButtonProps[]
    }
    footer: {
      credits: string
      socials: ExtendedButtonProps[]
    }
    toc: {
      title: string
      bottom: {
        title: string
        links: ExtendedButtonProps[]
      }
    }
    github: {
      owner: string
      name: string
      url: string
      branch: string
      rootDir: string
      commitPath: string
      since: string
      suffix: string
      per_page: number
      until: string
      author: string
      /**
       * 文件命名格式
       * @default 'auto'
       * @example 'kebab' | 'camel' | 'pascal' | 'auto'
       */
      casing: 'auto' | 'kebab' | 'camel' | 'pascal'
      /**
       * 日期格式化配置
       * @example { locale: 'zh-CN', options: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' } }
       */
      dateFormat: {
        locale?: string
        options?: Intl.DateTimeFormatOptions
      }
    } | false
    aiChat: {
      /**
       * 在文档页面底部显示浮动输入。
       * @default true
       */
      floatingInput: boolean
      /**
       * 在文档侧边栏中显示“使用 AI 进行解释”按钮。
       * @default true
       */
      explainWithAi?: boolean
      /**
       * 显示的常见问题解答问题。
       * @example 简单格式: ['如何安装？', '如何配置？']
       * @example 分类格式: [{ category: '入门', items: ['如何安装？'] }]
       */
      faqQuestions?: FaqQuestions
      /**
       * 键盘快捷键配置。
       */
      shortcuts: {
        /**
         * 快捷键，用于聚焦浮动输入框。
         * @default 'meta_i'
         */
        focusInput: string
      }
      /**
       * 文本配置。
       */
      texts: {
        /**
         * AI 聊天面板的标题文本。
         * @default 'AI 助手'
         */
        title: string
        /**
         * 折叠按钮的文本。
         * @default '折叠‘
         */
        collapse: string
        /**
         * 展开按钮的文本。
         * @default '展开'
         */
        expand: string
        /**
         * 清除聊天记录按钮的文本。
         * @default '清除聊天记录'
         */
        clearChat: string
        /**
         * 关闭按钮的文本。
         * @default '关闭'
         */
        close: string
        /**
         * 加载时的提示文本。
         * @default 'Loading...'
         */
        loading: string
        /**
         * 询问任何事情文本
         * @default '问我任何事情...'
         */
        askAnything: string
        /**
         * 询问任何事情描述文本
         * @default '我可以帮助您浏览文档、解释概念并回答您的问题。'
         */
        askMeAnythingDescription: string
        /**
         * FAQ 建议标题文本。
         * @default 'FAQ 建议'
         */
        faq: string
        /**
         * 浮动输入框的占位符文本。
         * @default '输入你的问题...'
         */
        placeholder: string
        /**
         * 换行的提示文本。
         * @default '换行'
         */
        lineBreak: string
        /**
         * AI 聊天面板触发按钮的提示文本。
         * @default '与 AI 聊天'
         */
        trigger: string
        /**
         * 思考时的提示文本。
         * @default '思考中...'
         */
        streaming: string
        /**
         * 思考后的提示文本。
         * @default '思考过程'
         */
        streamed: string
        /**
         * 使用 AI 进行解释按钮的文本。
         * @default '用 AI 解释此页面
         */
        explainWithAi: string
      }
      /**
       * 图标配置。
       */
      icons: {
        /**
         * 加载时的图标。
         * @default i-lucide-loader
         */
        loading: string
        /**
         * AI 聊天触发按钮和滑出层头部的图标。
         * @default 'i-lucide-sparkles'
         */
        trigger: string
        /**
         * "使用 AI 进行解释" 按钮的图标。
         * @default 'i-lucide-brain'
         */
        explain: string
        /**
         * 思考时的图标。
         * @default ui.icons.chevronDown
         */
        streaming: string
        /**
         * 清除聊天记录按钮的图标。
         * @default 'i-lucide-trash-2'
         */
        clearChat: string
        /**
         * 关闭按钮的图标。
         * @default 'i-lucide-x'
         */
        close: string
        /**
         * 用于映射不同 AI 提供商的图标。
         * @example { mistral: 'i-simple-icons-mistralai' }
         * @default { xxx: 'i-simple-xxx', mistral: 'i-simple-icons-mistralai', kwaipilot: 'i-lucide-wand', zai: 'i-lucide-wand' }
         */
        providers: Record<string, string>
      }
    }
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
