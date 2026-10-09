// @ts-expect-error - no types available
import { listComponentExamples } from '#component-example/nitro'

export default defineMcpResource({
  uri: 'resource://docs/examples',
  description: 'List of the available example names. Names only, not code.',
  cache: '1h',
  handler(uri: URL) {
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(listComponentExamples(), null, 2)
      }]
    }
  }
})
