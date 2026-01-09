export function useToolCall() {
  const tools: Record<string, string | ((args: any) => string)> = {
    'list-pages': '列出所有文档页面',
    'get-page': (args: any) => `检索 ${args?.path || '页面'}`
  }
  return {
    tools
  }
}
