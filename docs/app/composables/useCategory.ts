export function useCategory() {
  const categories = {
    'getting-started': [
      {
        id: 'core-concepts',
        title: '核心概念',
        icon: 'i-lucide-settings'
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
