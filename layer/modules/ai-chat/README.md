# AI Chat 模块

一个提供基于 MCP（模型上下文协议）工具的 AI 聊天界面的 Nuxt 模块。

## 功能特性

- 支持流式响应的 AI 聊天侧滑组件
- 集成 MCP 工具用于文档搜索
- 代码块语法高亮
- 常见问题建议
- 持久化聊天状态

## 安装

1. 将 `modules/ai-chat` 文件夹复制到你的 Nuxt 项目中
2. 安装所需依赖：

```bash
pnpm add @ai-sdk/mcp @ai-sdk/vue @ai-sdk/gateway ai motion-v shiki shiki-stream
```

3. 在 `nuxt.config.ts` 中添加模块：

```ts
export default defineNuxtConfig({
  modules: ['./modules/ai-chat'],

  aiChat: {
    apiPath: '/api/ai-chat',
    mcpPath: '/mcp',
    model: 'moonshotai/kimi-k2-turbo',
  }
})
```

## 使用方法

将组件添加到你的应用中：

```vue
<template>
  <div>
    <!-- 打开聊天的按钮 -->
    <AiChat tooltip-text="向 AI 提问" />

    <!-- 聊天侧滑面板（在应用或布局中放置一次即可） -->
    <AiChatSlideover
      title="AI 助手"
      placeholder="输入你的问题..."
      :faq-questions="faqQuestions"
    />
  </div>
</template>

<script setup>
const faqQuestions = [
  {
    category: '快速开始',
    items: ['如何安装？', '如何配置？'],
  },
  {
    category: '进阶使用',
    items: ['如何自定义？'],
  },
]
</script>
```

### 编程式控制

使用 `useAIChat` 组合式函数来控制聊天：

```vue
<script setup>
const { open, close, toggle, isOpen, messages, clearMessages } = useAIChat()

// 打开聊天并发送初始消息
open('如何安装这个模块？')

// 打开聊天并清除之前的消息
open('新问题', true)

// 切换聊天可见性
toggle()

// 清除所有消息
clearMessages()
</script>
```

## 模块配置

| 选项 | 类型 | 默认值 | 描述 |
|--------|------|---------|-------------|
| `apiPath` | `string` | `/api/ai-chat` | 聊天 API 端点路径 |
| `mcpPath` | `string` | `/mcp` | MCP 服务器连接路径 |
| `model` | `string` | `moonshotai/kimi-k2-turbo` | AI SDK Gateway 的模型标识符 |

## 组件属性

### `<AiChat>`

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `tooltipText` | `string` | `Ask AI a question` | 鼠标悬停时的提示文本 |

### `<AiChatSlideover>`

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `title` | `string` | `Ask AI` | 标题栏显示的标题 |
| `description` | `string` | `Ask AI` | 标题栏显示的描述 |
| `placeholder` | `string` | `Ask a question...` | 输入框占位符文本 |
| `faqQuestions` | `FaqCategory[]` | `undefined` | 聊天为空时显示的常见问题分类 |

#### FaqCategory 类型

```ts
interface FaqCategory {
  category: string
  items: string[]
}
```

## 环境要求

- Nuxt 4.x
- Nuxt UI 4.x（用于 `USlideover`、`UButton`、`UTextarea`、`UChatMessages` 等组件）
- 运行中的 MCP 服务器（路径可通过 `mcpPath` 配置）
- AI SDK Gateway Key

## 组件列表

- `AiChat` - 切换聊天侧滑面板的按钮
- `AiChatSlideover` - 主聊天界面
- `AiChatToolCall` - 显示 MCP 工具调用
- `AiChatPreStream` - 带流式语法高亮的代码块

## 自定义

### 系统提示词

要自定义 AI 的行为，请编辑以下文件中的系统提示词：
`runtime/server/api/search.ts`

### 样式

组件使用 Nuxt UI 和 Tailwind CSS 设计令牌。你可以通过修改组件文件或覆盖 UI 属性来自定义外观。

## 依赖

```json
{
  "@ai-sdk/mcp": "^0.0.8",
  "@ai-sdk/vue": "3.0.0-beta.105",
  "@ai-sdk/gateway": "^1.0.0",
  "ai": "6.0.0-beta.105",
  "motion-v": "^1.7.4",
  "shiki": "^3.0.0",
  "shiki-stream": "^0.1.2"
}
```
