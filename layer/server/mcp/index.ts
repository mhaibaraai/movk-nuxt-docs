import { defineMcpHandler, getMcpTools, listMcpTools } from '@nuxtjs/mcp-toolkit/server'

// 客户端可通过 X-MCP-Tools 请求头（逗号分隔的工具名）只暴露所需工具，减少上下文占用
export default defineMcpHandler({
  async tools(event) {
    const tools = await getMcpTools({ event, orphansOnly: true })
    const requestedTools = getHeader(event, 'x-mcp-tools')

    if (requestedTools === undefined) {
      return tools
    }

    // listMcpTools 解析出客户端在 tools/list 中看到的名称，与 getMcpTools 按下标对齐
    const toolNames = (await listMcpTools({ event, orphansOnly: true })).map(tool => tool.name)
    const requestedToolNames = new Set(requestedTools.split(',').map(name => name.trim()).filter(Boolean))

    const unknownNames = [...requestedToolNames].filter(name => !toolNames.includes(name))
    if (unknownNames.length) {
      throw createError({
        statusCode: 400,
        message: `Unknown MCP tool${unknownNames.length > 1 ? 's' : ''}: ${unknownNames.join(', ')}`
      })
    }

    return tools.filter((_, index) => {
      const name = toolNames[index]
      return name !== undefined && requestedToolNames.has(name)
    })
  }
})
