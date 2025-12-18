import type { ButtonProps } from '@nuxt/ui'

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
  header: {
    title: 'Movk Nuxt Docs',
    to: '/',
    search: true,
    colorMode: true,
    links: [] as ButtonProps[]
  },
  footer: {
    credits: `Copyright © 2024 - ${new Date().getFullYear()}`,
    socials: [] as ButtonProps[]
  },
  toc: {
    title: '页面导航',
    bottom: {
      title: '社区',
      links: [] as ButtonProps[]
    }
  }
})
