import type { Link } from '@unhead/vue'
import { withoutTrailingSlash } from 'ufo'

interface PageSeo {
  title: string
  description: string
  titleTemplate?: string
  article?: boolean
}

export function useMovkPageSeo({ title, description, titleTemplate, article }: PageSeo): void {
  const route = useRoute()
  const path = computed(() => withoutTrailingSlash(route.path) || '/')
  const sitePath = createSitePathResolver({ absolute: true, withBase: true })
  const canonical = sitePath(path)
  const markdown = article ? sitePath(computed(() => `${path.value}.md`)) : undefined

  useHead({
    link: computed(() => {
      const links: Link[] = [{ rel: 'canonical', href: canonical.value }]
      if (markdown) links.push({ rel: 'alternate', href: markdown.value, type: 'text/markdown' })
      return links
    })
  })

  useSeoMeta({
    ...titleTemplate !== undefined && { titleTemplate },
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: article ? 'article' : 'website',
    ogUrl: canonical
  })
}
