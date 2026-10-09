import { z } from 'zod'

export default defineMcpTool({
  description: 'Retrieves the source code of an example. Returns the code as a string only, without metadata. Use `list-examples` to find the exact example name.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    exampleName: z.string().describe('The name of the example (PascalCase)')
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
        throw createError({ statusCode: 404, message: `Example '${exampleName}' not found. Use the list-examples tool to see all available examples.` })
      }
      throw error
    }
  }
})
