export function useCategory() {
  const { t } = useI18n()

  const categories = {
    'getting-started': [
      {
        id: 'core-concepts',
        title: t('category.core-concepts'),
        icon: 'i-lucide-settings'
      },
      {
        id: 'ai',
        title: t('category.ai'),
        icon: 'i-lucide-bot'
      }
    ]
  }
  return {
    categories
  }
}
