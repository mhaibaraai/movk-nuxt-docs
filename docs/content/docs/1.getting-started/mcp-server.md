---
title: MCP Server
description: 内置 Model Context Protocol 服务器，将文档连接到 AI 工具。
category: ai
---

## 关于 MCP Server

每个 Movk Nuxt Docs 实例内置 Model Context Protocol (MCP) 服务器，任何 MCP 客户端（Claude、Cursor、VS Code 等）均可连接。

::note
**什么是 MCP？**

Model Context Protocol 是开放协议，支持 AI 应用与外部服务的标准化连接。通过 MCP，AI 助手可根据上下文主动搜索文档。
::

当连接到 AI 工具时，LLM 能够根据对话上下文智能地判断何时需要访问文档工具，从而在开发过程中为您提供更准确的文档引用和技术支持。

## 访问您的 MCP 服务器

您的 MCP 服务器可通过文档网址的 `/mcp` 路径自动访问。

::tip
例如，如果您的文档托管在 `https://docs.example.com`，则您的 MCP 服务器 URL 为 `https://docs.example.com/mcp`。
::

## 配置选项

### 禁用 MCP 服务器

在 `nuxt.config.ts` 中禁用 MCP 服务器：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  mcp: {
    enabled: false
  }
})
```

### 自定义服务器名称

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  mcp: {
    name: 'My Docs'
  }
})
```

## 内置工具

MOVK Docs MCP 提供两个开箱即用的工具：

### `list-pages`

列出所有可用的文档页面及分类信息。

**使用场景：**
- 搜索某个主题的文档但不知道确切路径
- 了解整体文档结构
- 查找特定类别的所有页面

### `get-page`

检索特定文档页面的完整内容。

**参数：**
- `path` *（必需）* - 页面路径，例如 `/docs/getting-started/installation`

**使用场景：**
- 获取确切路径页面的完整内容
- 引用特定页面的详细信息
- 获取完整 Markdown 源代码

## 设置指南

MCP 服务器采用 HTTP 传输协议，可安装于不同 AI 助手中。

### Claude Code

::note
**确保已安装 Claude Code** - 访问 [Anthropic 文档](https://docs.anthropic.com/en/docs/claude-code/quickstart) 获取安装说明。
::

使用 CLI 命令添加服务器：

```bash
claude mcp add --transport http my-docs https://docs.example.com/mcp
```

### Claude Desktop

1. 打开 Claude Desktop，前往「Settings」>「Developer」
2. 点击「Edit Config」，这将打开本地 Claude 目录
3. 使用自定义 MCP 服务器配置修改 `claude_desktop_config.json` 文件：

```json [claude_desktop_config.json]
{
  "mcpServers": {
    "my-docs": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://docs.example.com/mcp"
      ]
    }
  }
}
```

4. 重启 Claude Desktop 应用

### Cursor

::install-button
---
url: "https://docs.example.com/mcp"
---
::

或者在项目根目录创建或更新 `.cursor/mcp.json`：

```json [.cursor/mcp.json]
{
  "mcpServers": {
    "my-docs": {
      "type": "http",
      "url": "https://docs.example.com/mcp"
    }
  }
}
```

### Visual Studio Code

::note
**安装所需扩展** - 确保已安装 [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) 和 [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) 扩展。
::

::install-button
---
url: "https://docs.example.com/mcp"
ide: "vscode"
---
::

或者在项目的 `.vscode` 文件夹中创建或编辑 `mcp.json` 文件：

```json [.vscode/mcp.json]
{
  "servers": {
    "my-docs": {
      "type": "http",
      "url": "https://docs.example.com/mcp"
    }
  }
}
```

### ChatGPT

::note
**使用 MCP 的自定义连接器在 Web 上的 ChatGPT Pro 和 Plus 账户可用**。
::

1. **启用开发者模式**：前往设置 → Connectors → Advanced settings → Developer mode
2. **打开 ChatGPT 设置**
3. **在 Connectors 选项卡中，创建新连接器**：
   - 名称：`My Docs`
   - MCP server URL：`https://docs.example.com/mcp`
   - 认证：`None`
4. **点击创建**

My Docs 连接器将在对话期间出现在撰写器的「开发者模式」工具中。

### Opencode

在项目根目录创建 `opencode.json`：

```json [opencode.json]
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-docs": {
      "type": "remote",
      "url": "https://docs.example.com/mcp",
      "enabled": true
    }
  }
}
```

## 使用示例

配置完成后，您可以向 AI 助手提出如下问题，它们将自动使用 MCP 服务器查询文档：

- 「列出所有可用的文档页面」
- 「获取入门指南的内容」
- 「查找关于组件的文档」
- 「显示配置相关的文档页面」
- 「获取 /docs/getting-started/installation 页面的完整内容」
- 「有哪些关于主题定制的文档？」
- 「展示所有 API 参考文档」
- 「我需要了解如何部署项目，有相关文档吗？」

AI 助手将在生成响应时主动搜索文档，根据对话上下文智能判断何时需要查询工具，为您提供准确的文档引用和技术支持。

## 自定义扩展

您可以通过创建自定义组件来扩展 MCP 服务器的功能。

### 自定义工具

在 `server/mcp/tools/` 目录中创建自定义工具文件：

```ts [server/mcp/tools/my-tool.ts]
import { z } from 'zod/v4'

export default defineMcpTool({
  description: '工具的详细描述，帮助 AI 理解何时使用此工具',
  inputSchema: {
    param: z.string().describe('参数说明')
  },
  cache: '1h', // 可选：设置缓存时间
  handler: async ({ param }) => {
    // 工具逻辑
    return {
      content: [{ type: 'text', text: '返回内容' }]
    }
  }
})
```

### 自定义资源

在 `server/mcp/resources/` 目录中创建可被发现的资源：

```ts [server/mcp/resources/changelog.ts]
export default defineMcpResource({
  file: 'CHANGELOG.md',
  metadata: {
    description: '项目的变更日志',
  },
})
```

这会自动处理 URI 生成、MIME 类型检测和文件读取。

### 自定义提示

在 `server/mcp/prompts/` 目录中创建可重用的提示：

```ts [server/mcp/prompts/greeting.ts]
export default defineMcpPrompt({
  name: 'greeting',
  title: '问候',
  description: '生成个性化问候消息',
  handler: async () => {
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? '早上' : hour < 18 ? '下午' : '晚上'

    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `${timeOfDay}好！有什么可以帮您的吗？`,
        },
      }],
    }
  },
})
```

### 添加自定义处理程序

可以在 `server/mcp/` 目录下创建自定义处理器：

```ts [server/mcp/migration.ts]
import { z } from 'zod/v4'

const migrationTool = defineMcpTool({
  name: 'migrate-v3-to-v4',
  title: '将 v3 迁移到 v4',
  description: '将代码从版本 3 迁移到版本 4',
  inputSchema: {
    code: z.string().describe('要迁移的代码'),
  },
  handler: async ({ code }) => {
    const migrated = code.replace(/v3/g, 'v4')
    return {
      content: [{
        type: 'text',
        text: migrated,
      }],
    }
  },
})

export default defineMcpHandler({
  name: 'migration',
  version: '0.1.0',
  route: '/mcp/migration',
  tools: [migrationTool],
  browserRedirect: '/',
})
```

### 覆盖默认工具

要覆盖内置的 `list-pages` 或 `get-page` 工具，只需在 `server/mcp/tools/` 目录中创建同名文件即可。

```ts [server/mcp/tools/list-pages.ts]
import { z } from 'zod/v4'
export default defineMcpTool({
  description: '自定义列表页实现',
  inputSchema: {
    locale: z.string().optional(),
    category: z.string().optional(),
  },
  handler: async ({ locale, category }) => {
    const pages = await getCustomPageList(locale, category)
    return {
      content: [{ type: 'text', text: JSON.stringify(pages) }],
    }
  },
})
```

::tip{to="https://mcp-toolkit.nuxt.dev/"}
有关工具、资源、提示、处理程序和高级配置的更多信息，请查阅 Nuxt MCP Toolkit 工具包文档。
::
