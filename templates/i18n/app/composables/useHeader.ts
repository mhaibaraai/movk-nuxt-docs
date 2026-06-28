export function useHeader() {
  const route = useRoute()
  const { localePath } = useMovkI18n()

  const desktopLinks = computed(() => [{
    label: '文档',
    to: localePath('/docs/getting-started'),
    active: route.path.includes('/docs/')
  }])

  const mobileLinks = computed(() => [{
    label: '快速开始',
    icon: 'i-lucide-square-play',
    to: localePath('/docs/getting-started'),
    active: route.path.includes('/docs/getting-started')
  }])

  return {
    desktopLinks,
    mobileLinks
  }
}
