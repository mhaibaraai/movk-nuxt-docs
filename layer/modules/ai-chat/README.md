# AI Chat 模块

一个提供基于 MCP（模型上下文协议）工具的 AI 聊天界面的 Nuxt 模块。

## 功能

- 带有流式响应的 AI 聊天侧滑组件
- 用于快速提问的浮动输入组件
- 集成 MCP 工具进行文档搜索
- 代码块语法高亮
- FAQ 建议
- 持久化聊天状态
- 支持键盘快捷键
- 支持多种 AI 模型（通过 **AI SDK Gateway** 或 **OpenRouter**）
- 支持可用模型列表

## 安装

1. 将 `modules/ai-chat` 文件夹复制到你的 Nuxt 项目中
2. 安装所需依赖：

```bash
pnpm add @ai-sdk/mcp @ai-sdk/vue @ai-sdk/gateway @openrouter/ai-sdk-provider ai motion-v shiki shiki-stream
```

3. 在 `nuxt.config.ts` 中添加模块：

```ts
export default defineNuxtConfig({
  modules: ['./modules/ai-chat'],

  aiChat: {
    apiPath: '/api/ai-chat',
    mcpPath: '/mcp',
    model: 'openai/gpt-5-nano',
    models: [
      'openai/gpt-5-nano',
      'anthropic/claude-haiku-4.5',
      'google/gemini-2.5-flash',
      'openrouter/anthropic/claude-haiku-4.5',
      'openrouter/openai/gpt-5-nano',
    ],
  }
})
```

4. 将您的 API 密钥设置为环境变量：

```bash
# Using AI SDK Gateway
AI_GATEWAY_API_KEY=your-gateway-key

# Or using OpenRouter directly
OPENROUTER_API_KEY=your-openrouter-key
```

> **注意：** 仅当检测到以下 API 密钥之一时，该模块才会启用。如果未找到密钥，模块将被禁用，并在控制台中记录一条消息。

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

### Floating Input

使用 `AiChatFloatingInput` 在页面底部显示一个浮动输入框。

** 推荐：** 使用 `Teleport` 将浮动输入渲染到 body 级别，确保它无论在组件层次结构中如何变化都能固定在底部：

```vue
<template>
  <div>
    <!-- Teleport to body for proper fixed positioning -->
    <Teleport to="body">
      <ClientOnly>
        <LazyAiChatFloatingInput />
      </ClientOnly>
    </Teleport>

    <!-- Chat slideover (required to display responses) -->
    <AiChatSlideover title="AI 助手" />
  </div>
</template>
```

浮动输入框：
- 在视口下方中央显示
- 当聊天侧滑面板打开时自动隐藏
- 获得焦点时展开以获得更好的输入体验
- 支持键盘快捷键：`⌘I` 聚焦，`Escape` 失焦

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

## Composables

### `useAIChat`

控制聊天状态的主 composable。

```ts
const {
  isOpen,         // Ref<boolean> - 聊天是否打开
  messages,       // Ref<UIMessage[]> - 聊天消息列表
  pendingMessage, // Ref<string | undefined> - 待发送的消息
  open,           // (message?: string, clearPrevious?: boolean) => void - 打开聊天
  close,          // () => void - 关闭聊天
  toggle,         // () => void - 切换聊天状态
  clearMessages,  // () => void - 清除所有消息
  clearPending,   // () => void - 清除待发送消息
} = useAIChat()
```

### `useHighlighter`

用于语法高亮代码块的异步 composable（基于 Shiki）。

```ts
const highlighter = await useHighlighter()
// HighlighterGeneric - Shiki highlighter 实例
// 支持语言：vue, js, ts, css, html, json, yaml, markdown, bash
// 主题：material-theme-palenight, material-theme-lighter
```

### `useModels`

管理可用 AI 模型列表和当前选中的模型。

```ts
const {
  models,          // string[] - 可用模型列表
  model,           // ComputedRef<LanguageModel> - 当前模型实例
  formatModelName, // (modelId: string) => string - 格式化模型名称显示
} = useModels()
```

### `useTools`

管理 MCP 工具和 AI 模型实例的创建。

```ts
const {
  getToolLabel, // (toolName: string, args?: any) => string - 获取工具显示标签
  getModel,     // (modelId: string) => LanguageModel - 创建 AI 模型实例
} = useTools()
```

## 模块配置

| 选项 | 类型 | 默认值 | 描述 |
|--------|------|---------|-------------|
| `apiPath` | `string` | `/api/ai-chat` | 聊天 API 端点路径 |
| `mcpPath` | `string` | `/mcp` | MCP 服务器连接路径 |
| `model` | `string` | `-` | AI SDK Gateway、OpenRouter 的模型标识符 |
| `models` | `string[]` | `[]` | 可用模型列表（格式为 "provider/model" 或 "model"） |

## 组件属性

### `<AiChat>`

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `tooltipText` | `string` | `向 AI 提问` | 鼠标悬停时的提示文本 |

### `<AiChatFloatingInput>`

浮动输入框，位于视口下方。无需任何属性。

**键盘快捷键：**
- `⌘I` / `Ctrl+I` - 聚焦输入框
- `Escape` - 失焦输入框
- `Enter` - 提交问题

### `<AiChatToolCall>`

在聊天中显示 MCP 工具调用。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `text` | `string` | 必需 | 工具调用的标签文本 |
| `isLoading` | `boolean` | `false` | 为 true 时显示加载旋转圈 |

### `<AiChatModelSelect>`

模型选择下拉菜单，用于切换 AI 模型。无需任何属性。

该组件会自动显示 `nuxt.config.ts` 中配置的 `models` 列表，并使用 `useModels` 组合式函数管理模型状态。

### `<AiChatReasoning>`

显示 AI 思考过程的可折叠组件。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `text` | `string` | 必需 | 思考过程的文本内容 |
| `isStreaming` | `boolean` | `false` | 是否正在流式接收思考内容 |

### `<AiChatSlideover>`

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `title` | `string` | `AI 助手` | 标题栏显示的标题 |
| `description` | `string` | `向 AI 提问` | 标题栏显示的描述 |
| `placeholder` | `string` | `输入你的问题...` | 输入框占位符文本 |
| `faqQuestions` | `FaqCategory[]` | `-` | 聊天为空时显示的常见问题分类 |

### `<AiChatSlideoverFaq>`

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `faqQuestions` | `FaqCategory[]` | `-` | 聊天为空时显示的常见问题分类 |

#### FaqCategory 类型

```ts
interface FaqCategory {
  category: string
  items: string[]
}
```

### `<TextShimmer>`

带有闪光动画效果的文本组件，基于 motion-v 实现。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `text` | `string` | 必需 | 要显示的文本内容 |
| `as` | `string` | `p` | 渲染的 HTML 元素类型（如 'span'、'div'、'p'） |
| `duration` | `number` | `2` | 动画持续时间（秒） |
| `spread` | `number` | `2` | 闪光扩散范围（像素） |

**使用示例：**

```vue
<template>
  <TextShimmer text="AI 正在思考..." as="span" :duration="1.5" :spread="3" />
</template>
```

### `<AiChatPreStream>`

用于流式渲染代码块的组件，集成 Shiki 语法高亮。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `code` | `string` | 必需 | 要高亮显示的代码内容 |
| `language` | `string` | 必需 | 代码语言（如 'vue'、'javascript'、'typescript'） |
| `class` | `string` | `-` | 自定义 CSS 类名 |
| `meta` | `string` | `-` | 代码块元数据 |

**特性：**
- 自动根据颜色模式切换主题（亮色/暗色）
- 支持语言别名映射（如 'javascript' → 'js'）
- 自动清理代码格式（去除尾随反引号）
- 集成 `ProsePre` 组件样式

## 环境要求

- Nuxt 4.x
- Nuxt UI 4.x（用于 `USlideover`、`UButton`、`UTextarea`、`UChatMessages` 等组件）
- 运行中的 MCP 服务器（路径可通过 `mcpPath` 配置）
- 以下其中一个API密钥：
  - `AI_GATEWAY_API_KEY` - AI SDK Gateway key
  - `OPENROUTER_API_KEY` - OpenRouter API key

## 自定义

### 系统提示词

要自定义 AI 的行为，请编辑以下文件中的系统提示词：
`runtime/server/api/search.ts`

### 样式

组件使用 Nuxt UI 和 Tailwind CSS 设计令牌。你可以通过修改组件文件或覆盖 UI 属性来自定义外观。

## 依赖

```json
{
  "@ai-sdk/gateway": "^3.0.5",
  "@ai-sdk/mcp": "^1.0.2",
  "@ai-sdk/vue": "^3.0.6",
  "@openrouter/ai-sdk-provider": "^1.5.4",
  "ai": "^6.0.6",
  "motion-v": "^1.7.4",
  "shiki": "^3.20.0",
  "shiki-stream": "^0.1.2"
}
```
