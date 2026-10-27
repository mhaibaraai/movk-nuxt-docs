export default defineAppConfig({
  header: {
    nav: [
      { label: { 'zh-CN': '文档', 'en': 'Docs' }, to: '/docs/getting-started', activeMatch: '/docs' }
    ],
    mobileNav: [
      { label: { 'zh-CN': '快速开始', 'en': 'Getting Started' }, icon: 'i-lucide-square-play', to: '/docs/getting-started' }
    ]
  }
})
