import { z } from 'zod'

export default defineMcpTool({
  description: '检索特定的 UI 示例实现代码和详细信息',
  inputSchema: {
    exampleName: z.string().describe('示例名称（PascalCase）')
  },
  cache: '30m',
  async handler({ exampleName }) {
    try {
      const result = await $fetch<{ code: string }>(`/api/component-example/${exampleName}.json`)
      return {
        content: [{ type: 'text' as const, text: result.code }]
      }
    } catch {
      return errorResult(`示例 '${exampleName}' 未找到。使用 list_examples 工具查看所有可用示例。`)
    }
  }
})
