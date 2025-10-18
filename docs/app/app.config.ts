export default defineAppConfig({
  github: {
    rootDir: 'docs'
  },
  toc: {
    bottom: {
      links: [
        {
          icon: 'i-lucide-brain',
          to: 'https://docs.mhaibaraai.cn/llms.txt',
          target: '_blank',
          label: 'Open LLMs'
        },
        {
          icon: 'i-lucide-link',
          to: 'https://docs.mhaibaraai.cn/__link-checker__/link-checker-report.html',
          target: '_blank',
          label: 'Open Link Checker'
        }
      ]
    }
  },
  footer: {
    socials: [
      {
        'icon': 'i-simple-icons-nuxtdotjs',
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
  }
})
