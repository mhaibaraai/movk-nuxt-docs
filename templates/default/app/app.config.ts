export default defineAppConfig({
  header: {
    nav: [
      { label: '文档', to: '/docs/getting-started', activeMatch: '/docs' }
    ],
    mobileNav: [
      { label: '快速开始', icon: 'i-lucide-square-play', to: '/docs/getting-started' }
    ]
  },
  docs: {
    categories: {
      'getting-started': [
        { id: 'core-concepts', title: '核心概念', icon: 'i-lucide-settings' }
      ]
    }
  }
})
