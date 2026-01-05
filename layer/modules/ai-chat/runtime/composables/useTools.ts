import { createGateway } from '@ai-sdk/gateway'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export interface ToolLabelConfig {
  toolName: string
  label: string | ((args: any) => string)
}

export function useTools() {
  const defaultLabels: Record<string, string | ((args: any) => string)> = {
    'list-pages': '列出所有文档页面',
    'get-page': (args: any) => `检索 ${args?.path || '页面'}`
  }

  /**
   * 获取工具的显示标签
   * @param toolName - 工具名称
   * @param args - 工具参数
   * @returns 工具的显示标签
   */
  function getToolLabel(toolName: string, args?: any): string {
    const label = defaultLabels[toolName]

    if (!label) {
      return toolName
    }

    return typeof label === 'function' ? label(args) : label
  }

  /**
   * 获取 AI 模型实例
   * @param modelId - 模型标识符,格式为 "provider/model" 或 "model"
   * @returns AI SDK 模型实例
   */
  function getModel(modelId: string) {
    const config = useRuntimeConfig()

    // OpenRouter 模型:以 "openrouter/" 开头
    if (modelId.startsWith('openrouter/')) {
      const openRouter = createOpenRouter({
        apiKey: config.openRouterApiKey as string | undefined
      })
      return openRouter.chat(modelId.replace('openrouter/', ''))
    }

    // AI Gateway 模型(默认)
    const gateway = createGateway({
      apiKey: config.aiGatewayApiKey as string | undefined
    })
    return gateway(modelId)
  }

  return {
    getToolLabel,
    getModel
  }
}
