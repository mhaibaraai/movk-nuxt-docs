// @ts-expect-error - no types available
import { listComponentExamples } from '#component-example/nitro'

export default defineMcpResource({
  uri: 'resource://docs/examples',
  description: '所有可用示例代码和演示的完整列表',
  cache: '1h',
  async handler(uri: URL) {
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(await listComponentExamples(), null, 2)
      }]
    }
  }
})
