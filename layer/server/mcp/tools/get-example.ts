import { z } from 'zod'

export default defineMcpTool({
  description: '检索特定的示例实现代码和详细信息',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    exampleName: z.string().describe('示例名称（PascalCase）')
  },
  inputExamples: [
    { exampleName: 'ButtonBasic' },
    { exampleName: 'ModalOverlay' }
  ],
  cache: '30m',
  async handler({ exampleName }) {
    try {
      const result = await $fetch<{ code: string }>(`/api/component-example/${exampleName}.json`)
      return result.code
    } catch (error: unknown) {
      const err = error as { statusCode?: number, response?: { status?: number } }
      const status = err?.statusCode ?? err?.response?.status
      if (status === 404) {
        throw createError({ statusCode: 404, message: `示例 '${exampleName}' 未找到。使用 list_examples 工具查看所有可用示例。` })
      }
      throw error
    }
  }
})
