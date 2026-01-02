export function useCategory() {
  const categories = {
    components: [
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
