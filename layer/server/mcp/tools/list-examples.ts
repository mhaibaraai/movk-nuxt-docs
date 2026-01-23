// @ts-expect-error - no types available
import components from '#component-example/nitro'

export default defineMcpTool({
  description: '列出所有可用的 UI 示例和代码演示',
  cache: '1h',
  handler() {
    const examples = Object.entries<{ pascalName: string }>(components).map(([_key, value]) => {
      return value.pascalName
    })

    return jsonResult(examples)
  }
})
