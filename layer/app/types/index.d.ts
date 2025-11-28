import type { ButtonProps } from '@nuxt/ui'

declare module 'nuxt/schema' {
  interface AppConfig {
    seo: {
      titleTemplate: string
      title: string
      description: string
    }
    header: {
      title: string
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
      author?: string
    } | false
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
