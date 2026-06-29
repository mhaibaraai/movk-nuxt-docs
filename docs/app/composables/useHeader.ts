export function useHeader() {
  const route = useRoute()
  const { t } = useI18n()
  const { localePath, docsRoot } = useMovkI18n()

  const desktopLinks = computed(() => [{
    label: t('nav.docs'),
    to: localePath('/docs/getting-started'),
    active: route.path.startsWith(docsRoot.value)
  }, {
    label: t('nav.examples'),
    to: localePath('/templates')
  }, {
    label: t('nav.releases'),
    to: localePath('/releases')
  }])

  const mobileLinks = computed(() => [{
    label: t('nav.gettingStarted'),
    icon: 'i-lucide-square-play',
    to: localePath('/docs/getting-started'),
    active: route.path.startsWith(localePath('/docs/getting-started'))
  }, {
    label: t('nav.typography'),
    icon: 'i-lucide-square-pilcrow',
    to: localePath('/docs/typography'),
    active: route.path.startsWith(localePath('/docs/typography'))
  }, {
    label: t('nav.components'),
    icon: 'i-lucide-component',
    to: localePath('/docs/components'),
    active: route.path.startsWith(localePath('/docs/components'))
  }, {
    label: t('nav.composables'),
    icon: 'i-lucide-square-function',
    to: localePath('/docs/composables'),
    active: route.path.startsWith(localePath('/docs/composables'))
  }, {
    label: t('nav.examples'),
    icon: 'i-lucide-layout-template',
    to: localePath('/templates')
  }, {
    label: t('nav.releases'),
    icon: 'i-lucide-newspaper',
    to: localePath('/releases')
  }, {
    label: 'GitHub',
    to: 'https://github.com/mhaibaraai/movk-nuxt-docs',
    icon: 'i-simple-icons-github',
    target: '_blank'
  }])

  return {
    desktopLinks,
    mobileLinks
  }
}
