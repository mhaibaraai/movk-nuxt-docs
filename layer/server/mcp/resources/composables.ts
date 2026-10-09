import { queryCollection } from '@nuxt/content/server'

export default defineMcpResource({
  uri: 'resource://docs/composables',
  description: 'List of composables with the path, title and description of each',
  cache: '1h',
  async handler(uri: URL) {
    const event = useEvent()

    const composables = await queryCollection(event, 'docs')
      .where('path', 'LIKE', '%/composables/%')
      .where('extension', '=', 'md')
      .select('path', 'title', 'description')
      .all()

    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(composables, null, 2)
      }]
    }
  }
})
