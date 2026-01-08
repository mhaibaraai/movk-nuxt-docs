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

  return {
    getToolLabel
  }
}
