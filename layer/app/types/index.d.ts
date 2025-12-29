import type { ButtonProps } from '@nuxt/ui'

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
      links: ButtonProps[]
    }
    footer: {
      credits: string
      socials: ButtonProps[]
    }
    toc: {
      title: string
      bottom: {
        title: string
        links: ButtonProps[]
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
       * 日期格式化配置
       * @example { locale: 'zh-CN', options: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' } }
       */
      dateFormat: {
        locale?: string
        options?: Intl.DateTimeFormatOptions
      }
    } | false
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
