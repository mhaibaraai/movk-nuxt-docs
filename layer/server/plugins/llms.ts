export default defineNitroPlugin((nitroApp) => {
  /**
   * @see
   * https://github.com/nuxt-content/nuxt-llms?tab=readme-ov-file#readme
   */
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
    const docSetIdx = sections.findIndex(s => s.title === 'Documentation Sets')
    if (docSetIdx !== -1) {
      const [docSet] = sections.splice(docSetIdx, 1)
      sections.push(docSet)
    }
  })
})
