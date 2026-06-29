export function useHeader() {
  const route = useRoute()
  const { t } = useI18n()
  const { localePath } = useMovkI18n()

  const isActive = (path: string) => route.path.startsWith(localePath(path))

  const desktopLinks = computed(() => [{
    label: t('nav.docs'),
    to: localePath('/docs/getting-started'),
    active: isActive('/docs')
  }, {
    label: t('nav.examples'),
    to: localePath('/templates')
  }, {
    label: t('nav.releases'),
    to: localePath('/releases')
  }])

  const docsNav = [
    { key: 'gettingStarted', icon: 'i-lucide-square-play', path: '/docs/getting-started' },
    { key: 'typography', icon: 'i-lucide-square-pilcrow', path: '/docs/typography' },
    { key: 'components', icon: 'i-lucide-component', path: '/docs/components' },
    { key: 'composables', icon: 'i-lucide-square-function', path: '/docs/composables' }
  ]

  const mobileLinks = computed(() => [
    ...docsNav.map(({ key, icon, path }) => ({
      label: t(`nav.${key}`),
      icon,
      to: localePath(path),
      active: isActive(path)
    })),
    {
      label: t('nav.examples'),
      icon: 'i-lucide-layout-template',
      to: localePath('/templates')
    },
    {
      label: t('nav.releases'),
      icon: 'i-lucide-newspaper',
      to: localePath('/releases')
    },
    {
      label: 'GitHub',
      to: 'https://github.com/mhaibaraai/movk-nuxt-docs',
      icon: 'i-simple-icons-github',
      target: '_blank'
    }
  ])

  return {
    desktopLinks,
    mobileLinks
  }
}
