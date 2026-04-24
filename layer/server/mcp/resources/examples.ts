// @ts-expect-error - no types available
import { listComponentExamples } from '#component-example/nitro'

export default defineMcpResource({
  uri: 'resource://docs/examples',
  description: 'Complete list of available example code and demonstrations',
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
