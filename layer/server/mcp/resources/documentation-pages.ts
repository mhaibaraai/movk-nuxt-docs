import { queryCollection } from '@nuxt/content/server'

export default defineMcpResource({
  uri: 'resource://docs/documentation-pages',
  description: 'Complete list of available documentation pages',
  cache: '1h',
  async handler(uri: URL) {
    const event = useEvent()

    const pages = await queryCollection(event, 'docs').all()

    const result = pages.map(doc => ({
      title: doc.title,
      description: doc.description,
      path: doc.path
    }))

    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(result, null, 2)
      }]
    }
  }
})
