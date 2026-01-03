export function useCategory() {
  const categories = {
    'getting-started': [
      {
        id: 'core-concepts',
        title: '核心概念',
        icon: 'i-lucide-settings'
      },
      {
        id: 'ai',
        title: 'AI 集成',
        icon: 'i-lucide-bot'
      }
    ],
    'components': [
      {
        id: 'components',
        title: 'Components',
        icon: 'i-lucide-layout-dashboard'
      },
      {
        id: 'example',
        title: 'Example',
        icon: 'i-lucide-box'
      }
    ]
  }
  return {
    categories
  }
}
