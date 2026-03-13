---
title: AI Chat
description: 智能文档助手组件和 API 参考
category: ai
---

## 概述

一个提供基于 MCP（模型上下文协议）工具的 AI 聊天界面的 Nuxt 模块。

::div{class="flex justify-center bg-muted py-5"}
  ::nuxt-img{src="/ai/AiChat.png" alt="AiChat" height="600"}
  ::
::

## 快速开始

Movk Nuxt Docs 已内置 AI Chat 模块。要启用该模块，请进行以下配置：

::steps

### 在 `nuxt.config.ts` 中添加模块配置：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  aiChat: {
    model: 'zai/glm-4.7',
    models: [
      'zai/glm-4.7',
      'anthropic/claude-sonnet-4.6',
      'google/gemini-2.5-flash'
    ],
  }
})
```

模块配置选项：

| 选项 | 类型 | 默认值 | 描述 |
|--------|------|---------|-------------|
| `apiPath` | `string`{lang="ts-type"} | `/api/ai-chat` | 聊天 API 端点路径 |
| `mcpPath` | `string`{lang="ts-type"} | `/mcp` | MCP 服务器连接路径 |
| `model` | `string`{lang="ts-type"} | `-` | 模型标识符 |
| `models` | `string[]`{lang="ts-type"} | `[]` | 可用模型列表（格式为 "provider/model" 或 "model"） |

### 在 `app/app.config.ts` 中配置 AI Chat 功能：

```ts [app/app.config.ts]
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
```

  ::warning
  如果未找到密钥，模块将被禁用，并在控制台中记录一条消息。
  ::

::

## 手动安装

您可以选择手动安装该模块：

- 将 `modules/ai-chat` 文件夹复制到你的 Nuxt 项目中
- 安装所需依赖：
```bash
pnpm add @ai-sdk/mcp @ai-sdk/vue @ai-sdk/gateway @shiki/core @shiki/engine-javascript @shiki/langs @shiki/themes motion-v shiki-stream
```

## 自动集成

::tip
AI Chat 功能已内置在 Movk Nuxt Docs 中，无需手动添加组件。
::

默认情况下，以下功能会自动启用：

- **AI Chat 触发按钮**：在页面右侧显示，点击打开 AI 助手面板
- **浮动输入框**：在文档页面底部显示（可通过 `appConfig.aiChat.floatingInput` 控制）
- **AI 解释按钮**：在文档侧边栏显示（可通过 `appConfig.aiChat.explainWithAi` 控制）

### 手动集成（可选）

如果需要在自定义页面中使用 AI Chat 组件：

```vue
<template>
  <div>
    <AiChat />
    <AiChatPanel />
  </div>
</template>
```

::note
FAQ 问题现在在 `app/app.config.ts` 中配置，无需在组件中传递 props。
::

### 浮动输入框

浮动输入框默认已集成在文档页面底部。如需在自定义页面中使用：

```vue
<template>
  <div>
    <Teleport to="body">
      <ClientOnly>
        <AiChatPanel />
        <AiChatFloatingInput />
      </ClientOnly>
    </Teleport>
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
  isEnabled,
  isOpen,
  messages,
  toggleChat,
  open
} = useAIChat()

// 打开聊天并发送初始消息
open('如何安装这个模块？')

// 切换聊天可见性
toggle()
</script>
```

## 自定义

### 自定义模型提供商

::note{to="https://ai-sdk.dev/providers/ai-sdk-providers/"}
查看 AI SDK 支持的提供商列表
::

```ts [server/plugins/modelProviders.ts]
import { modelProviderRegistry } from '#ai-chat/server/utils/modelProviders'
import { createAnthropic } from '@ai-sdk/anthropic'

export default defineNitroPlugin(() => {
  // 覆盖默认提供商配置
  modelProviderRegistry.register('anthropic', ({ config, modelId }) => {
    const anthropic = createAnthropic({
      apiKey: config.anthropicApiKey,
      // 自定义配置...
    })
    return anthropic(modelId)
  })
})
```

配置环境变量：

```bash [.env]
ANTHROPIC_API_KEY=your_api_key
```

#### 内置提供商

| 提供商 | 前缀 | 环境变量 |
|--------|------|----------|
| AI Gateway | 无（默认） | `AI_GATEWAY_API_KEY` |

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

## API

### `AiChat`

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

### `AiChatFloatingInput`

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

### `AiChatToolCall`

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

### `AiChatModelSelect`

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

### `AiChatPanel`

完整的 AI 聊天面板界面。

**特性：**
- 可展开/折叠的侧边栏面板
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

### `AiChatDisabled`

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

## Composables

### `useAIChat()`{lang="ts-type"}

对话状态管理，提供聊天界面的状态控制和消息管理功能。

#### 返回值

::field-group
  ::field{name="isOpen" type="Ref<boolean>"}
  对话框是否打开的响应式状态。
  ::

  ::field{name="messages" type="Ref<UIMessage[]>"}
  消息列表，包含所有历史对话记录。
  ::

  :::field{name="open" type="(text: string) => void"}
  打开对话框并发送初始消息。

    :::collapsible
      ::field-group
        ::field{name="text" type="string"}
        初始消息，打开对话框时自动发送。
        ::
      ::
    :::
  :::

  ::field{name="toggleChat" type="() => void"}
  切换对话框的打开/关闭状态。
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
        模型 ID，格式如 `openrouter/anthropic/claude-sonnet-4.6`。
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
