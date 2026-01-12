---
title: AI Chat
description: 智能文档助手组件和 API 参考
category: ai
---

## 概述

一个提供基于 MCP（模型上下文协议）工具的 AI 聊天界面的 Nuxt 模块。

**主要功能：**
- 支持多种 AI 模型（通过 **AI SDK Gateway** 或 **OpenRouter**）
- 带有流式响应的 AI 聊天侧滑组件
- 用于快速提问的浮动输入组件
- MCP 工具调用（文档检索）
- 代码高亮和 Markdown 渲染
- 思考过程展示（Extended Thinking）
- 持久化聊天状态
- 支持键盘快捷键
- 支持可用模型列表选取

![AiChat]( /ai/AiChat.png )

## 快速开始

Movk Nuxt Docs 已内置 AI Chat 模块。要启用该模块，请进行以下配置：

::steps

### 在 `nuxt.config.ts` 中添加模块配置：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  aiChat: {
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

模块配置选项：

| 选项 | 类型 | 默认值 | 描述 |
|--------|------|---------|-------------|
| `apiPath` | `string`{lang="ts-type"} | `/api/ai-chat` | 聊天 API 端点路径 |
| `mcpPath` | `string`{lang="ts-type"} | `/mcp` | MCP 服务器连接路径 |
| `model` | `string`{lang="ts-type"} | `-` | AI SDK Gateway、OpenRouter 的模型标识符 |
| `models` | `string[]`{lang="ts-type"} | `[]` | 可用模型列表（格式为 "provider/model" 或 "model"） |

### 在 `app.config.ts` 中配置 AI Chat 功能：

```ts [app.config.ts]
export default defineAppConfig({
  aiChat: {
    floatingInput: true,
    explainWithAi: true,
    faqQuestions: [
      {
        category: '快速开始',
        items: ['如何安装？', '如何配置？'],
      },
      {
        category: '进阶使用',
        items: ['如何自定义？'],
      },
    ],
    shortcuts: {
      focusInput: 'meta_i'
    },
    texts: {
      title: 'AI 助手',
      placeholder: '输入你的问题...',
      // ... 更多文本配置
    }
  }
})
```

::tip{to="/docs/getting-started/configuration#ai-chat"}
查看完整的 AI Chat 配置选项
::

### 将您的 API 密钥设置为环境变量：

```bash [.env]
# Using AI SDK Gateway
AI_GATEWAY_API_KEY=your-gateway-key

# Or using OpenRouter directly
OPENROUTER_API_KEY=your-openrouter-key
```

::warning
仅当检测到以上 API 密钥之一时，该模块才会启用。如果未找到密钥，模块将被禁用，并在控制台中记录一条消息。
::

::

## 手动安装

您可以选择手动安装该模块：

- 将 `modules/ai-chat` 文件夹复制到你的 Nuxt 项目中
- 安装所需依赖：

```bash
pnpm add @ai-sdk/mcp @ai-sdk/vue @ai-sdk/gateway @openrouter/ai-sdk-provider ai motion-v shiki shiki-stream
```

## 使用方法

AI Chat 功能已内置在 Movk Nuxt Docs 中，无需手动添加组件。

### 自动集成

默认情况下，以下功能会自动启用：

- **AI Chat 触发按钮**：在页面右侧显示，点击打开 AI 助手面板
- **浮动输入框**：在文档页面底部显示（可通过 `appConfig.aiChat.floatingInput` 控制）
- **AI 解释按钮**：在文档侧边栏显示（可通过 `appConfig.aiChat.explainWithAi` 控制）

### 手动集成（可选）

如果需要在自定义页面中使用 AI Chat 组件：

```vue
<template>
  <div>
    <!-- 打开聊天的按钮 -->
    <AiChat />

    <!-- AI Chat 面板（在应用或布局中放置一次即可） -->
    <AiChatPanel />
  </div>
</template>
```

::note
FAQ 问题现在在 `app.config.ts` 中配置，无需在组件中传递 props。
::

### 浮动输入框

浮动输入框默认已集成在文档页面底部。如需在自定义页面中使用：

```vue
<template>
  <div>
    <!-- Teleport to body for proper fixed positioning -->
    <Teleport to="body">
      <ClientOnly>
        <LazyAiChatFloatingInput />
      </ClientOnly>
    </Teleport>

    <!-- Chat panel (required to display responses) -->
    <AiChatPanel />
  </div>
</template>
```

::tip
使用 `Teleport` 将浮动输入渲染到 body 级别，确保它无论在组件层次结构中如何变化都能固定在底部
::

### 编程式控制

使用 `useAIChat` 组合式函数来控制聊天：

```vue
<script setup>
const {
  open,
  close,
  toggle,
  toggleExpanded,
  isOpen,
  isExpanded,
  messages,
  clearMessages,
  panelWidth
} = useAIChat()

// 打开聊天并发送初始消息
open('如何安装这个模块？')

// 打开聊天并清除之前的消息
open('新问题', true)

// 切换聊天可见性
toggle()

// 切换面板展开状态
toggleExpanded()

// 清除所有消息
clearMessages()

// 访问面板宽度（响应式）
console.log(panelWidth.value) // '400px' or '800px'
</script>
```

## 组件 API

### AiChat

最简单的集成方式，展示助手按钮。

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/components/AiChat.vue
target: _blank
variant: link
---
查看源代码
::

### AiChatFloatingInput

浮动输入框，位于视口下方。无需任何属性。

**键盘快捷键：**
- `⌘I` / `Ctrl+I` - 聚焦输入框
- `Escape` - 失焦输入框
- `Enter` - 提交问题

::note
需使用 `Teleport` 和 `ClientOnly` 包裹以确保正确渲染。
::

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/components/AiChatFloatingInput.vue
target: _blank
variant: link
---
查看源代码
::

### AiChatToolCall

在聊天中显示 MCP 工具调用。

::tip{to="/docs/composables/use-tool-call"}
您可以通过创建 `composables/useToolCall.ts` 文件来覆盖默认的问题列表。
::

:component-props{slug="AiChatToolCall"}

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/components/AiChatToolCall.vue
target: _blank
variant: link
---
查看源代码
::

### AiChatModelSelect

模型选择下拉菜单，用于切换 AI 模型。无需任何属性。

::note
该组件会自动显示 `nuxt.config.ts` 中配置的 `models` 列表，并使用 `useModels` 组合式函数管理模型状态。
::

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/components/AiChatModelSelect.vue
target: _blank
variant: link
---
查看源代码
::

### AiChatReasoning

显示 AI 思考过程的可折叠组件。

:component-props{slug="AiChatReasoning"}

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/components/AiChatReasoning.vue
target: _blank
variant: link
---
查看源代码
::

### AiChatSlideoverFaq

显示聊天为空时的常见问题分类。

::tip{to="/docs/getting-started/configuration#ai-chat"}
FAQ 问题现在在 `app.config.ts` 的 `aiChat.faqQuestions` 中配置。
::

:component-props{slug="AiChatSlideoverFaq"}

```ts
interface FaqCategory {
  category: string
  items: string[]
}
```

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/components/AiChatSlideoverFaq.vue
target: _blank
variant: link
---
查看源代码
::

### AiChatPanel

完整的 AI 聊天面板界面，支持侧边栏模式和可调整宽度。

**特性：**
- 可展开/折叠的侧边栏面板
- 响应式宽度调整（400px/800px）
- 自动推动主内容区域
- 内置消息历史和流式响应
- 支持代码高亮和 Markdown 渲染

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/components/AiChatPanel.vue
target: _blank
variant: link
---
查看源代码
::

### AiChatDisabled

当 AI Chat 功能未启用时显示的禁用状态组件。

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/components/AiChatDisabled.vue
target: _blank
variant: link
---
查看源代码
::

### AiChatPreStream

用于流式渲染代码块的组件，集成 Shiki 语法高亮。

::note
**特性：**
- 自动根据颜色模式切换主题（亮色/暗色）
- 支持语言别名映射（如 'javascript' → 'js'）
- 自动清理代码格式（去除尾随反引号）
- 集成 `ProsePre` 组件样式
::

:component-props{slug="AiChatPreStream"}

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/components/AiChatPreStream.vue
target: _blank
variant: link
---
查看源代码
::

## Composables

### `useAIChat()`{lang="ts-type"}

对话状态管理，提供聊天界面的状态控制和消息管理功能。

#### 返回值

::field-group
  ::field{name="isOpen" type="Ref<boolean>"}
  对话框是否打开的响应式状态。
  ::

  ::field{name="isExpanded" type="Ref<boolean>"}
  面板是否展开的响应式状态（展开为 800px，折叠为 400px）。
  ::

  ::field{name="isMobile" type="Ref<boolean>"}
  是否为移动设备的响应式状态。
  ::

  ::field{name="panelWidth" type="Ref<string>"}
  面板宽度的响应式状态（'400px' 或 '800px'）。
  ::

  ::field{name="messages" type="Ref<UIMessage[]>"}
  消息列表，包含所有历史对话记录。
  ::

  ::field{name="pendingMessage" type="Ref<string | undefined>"}
  待发送的消息内容，用于在打开对话框前预设问题。
  ::

  ::field{name="faqQuestions" type="Ref<FaqQuestions>"}
  从 `app.config.ts` 读取的 FAQ 问题列表。
  ::

  :::field{name="open" type="(message?: string, clearHistory?: boolean) => void"}
  打开对话框并可选地发送初始消息。

  :::collapsible
    ::field-group
      ::field{name="message" type="string"}
      可选的初始消息，打开对话框时自动发送。
      ::

      ::field{name="clearHistory" type="boolean"}
      是否清除之前的消息历史，默认为 `false`。
      ::
    ::
  :::
  :::

  ::field{name="close" type="() => void"}
  关闭对话框。
  ::

  ::field{name="toggle" type="() => void"}
  切换对话框的打开/关闭状态。
  ::

  ::field{name="toggleExpanded" type="() => void"}
  切换面板展开/折叠状态。
  ::

  ::field{name="clearMessages" type="() => void"}
  清除所有历史消息。
  ::

  ::field{name="clearPending" type="() => void"}
  清除待发送的消息。
  ::
::

### `useModels()`{lang="ts-type"}

模型配置管理，控制可用的 AI 模型列表和当前选中的模型。

#### 返回值

::field-group
  ::field{name="models" type="Ref<string[]>"}
  可用模型列表，从 `nuxt.config.ts` 的 `aiChat.models` 配置读取。
  ::

  ::field{name="model" type="Ref<string>"}
  当前选中的模型 ID，会持久化到 localStorage。
  ::

  :::field{name="formatModelName" type="(modelId: string) => string"}
  格式化模型 ID 为易读的显示名称（去除前缀和后缀）。
  :::collapsible
    ::field-group
      ::field{name="modelId" type="string" required}
      模型 ID，格式如 `openrouter/mistralai/devstral-2512:free`。
      ::
    ::
  :::
  :::
::

### `useHighlighter()`{lang="ts-type"}

异步加载 Shiki 代码高亮器实例，用于代码块的语法高亮渲染。

#### 返回值

返回一个 Promise，resolve 为配置好的 Shiki Highlighter 实例。

::note
**支持的语言：** `vue`, `js`, `ts`, `css`, `html`, `json`, `yaml`, `markdown`, `bash`

**支持的主题：**
- `material-theme-palenight`（深色模式）
- `material-theme-lighter`（浅色模式）
::

```ts
const highlighter = await useHighlighter()

// 使用示例
const html = highlighter.codeToHtml(code, {
  lang: 'typescript',
  theme: 'material-theme-palenight'
})
```

## 自定义

### 系统提示词

要自定义 AI 的行为，请创建编辑以下文件中的系统提示词：
`server/api/ai-chat.ts`

::u-button
---
color: neutral
icon: i-lucide-code-xml
to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/ai-chat/runtime/server/api/ai-chat.ts
target: _blank
variant: link
---
默认系统提示词
::

### 样式

组件使用 Nuxt UI 和 Tailwind CSS 设计令牌。你可以通过修改组件文件或覆盖 UI 属性来自定义外观。

## 版本依赖

```json [package.json]
{
  "@ai-sdk/gateway": "^3.0.11",
  "@ai-sdk/mcp": "^1.0.5",
  "@ai-sdk/vue": "^3.0.27",
  "@openrouter/ai-sdk-provider": "^1.5.4",
  "ai": "^6.0.27",
  "motion-v": "^1.8.1",
  "shiki": "^3.21.0",
  "shiki-stream": "^0.1.4"
}
```
