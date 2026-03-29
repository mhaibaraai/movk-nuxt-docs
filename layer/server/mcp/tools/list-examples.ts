// @ts-expect-error - no types available
import { listComponentExamples } from '#component-example/nitro'

export default defineMcpTool({
  description: '列出所有可用的示例和代码演示',
  cache: '1h',
  async handler() {
    return await listComponentExamples()
  }
})
