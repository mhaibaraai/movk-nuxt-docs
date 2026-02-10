import type { H3Event } from 'h3'
import type { PageCollectionItemBase } from '@nuxt/content'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', async (event: H3Event, doc: PageCollectionItemBase) => {
    await transformMDC(event, doc as any)
  })

  nitroApp.hooks.hook('llms:generate', (_, { sections, domain }) => {
    // Transform links except for "Documentation Sets"
    sections.forEach((section) => {
      if (section.title !== 'Documentation Sets') {
        section.links = section.links?.map(link => ({
          ...link,
          href: `${link.href.replace(new RegExp(`^${domain}`), `${domain}/raw`)}.md`
        }))
      }
    })

    // Move "Documentation Sets" to the end
    const docSetIdx = sections.findIndex((s: any) => s.title === 'Documentation Sets')
    if (docSetIdx !== -1) {
      const [docSet] = sections.splice(docSetIdx, 1)
      if (docSet) {
        sections.push(docSet)
      }
    }
  })
})
