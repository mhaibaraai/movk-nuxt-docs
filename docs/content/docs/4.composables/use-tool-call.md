---
title: useToolCall
description: AI 聊天工具定义 Composable，用于配置工具调用的显示文本和图标。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/useToolCall.ts
---

## 概述

`useToolCall` 是 AI 聊天模块的扩展点，允许用户自定义工具调用时显示的文本标签和图标。

当 AI 助手调用工具时，`AiChatPanel` 组件会调用此 composable 获取对应工具的显示信息。默认实现返回空对象，内置工具标签由组件自身处理。通过在应用层覆盖此 composable，可以为自定义工具添加显示支持。

## 使用示例

### 扩展自定义工具

在应用层创建同名 composable 覆盖默认实现：

```ts [composables/useToolCall.ts]
import type { ToolState } from '#ai-chat/types'

export function useToolCall(state: ToolState, toolName: string, input: Record<string, string | undefined>) {
  const searchVerb = state === 'output-available' ? '已搜索' : '搜索中'
  const readVerb = state === 'output-available' ? '已读取' : '读取中'

  const toolMessage: Record<string, string> = {
    'search-api': `${searchVerb} API 文档`,
    'get-schema': `${readVerb} ${input.name || ''} 类型定义`,
  }

  const toolIcon: Record<string, string> = {
    'search-api': 'i-lucide-book-open',
    'get-schema': 'i-lucide-braces',
  }

  return {
    toolMessage,
    toolIcon,
  }
}
```

### 内置工具的默认处理

以下工具由 `AiChatPanel` 内置处理，无需在 `useToolCall` 中定义：

| 工具名 | 显示文本 | 图标 |
|--------|----------|------|
| `list-getting-started-guides` | 搜索中 / 已搜索 入门指南 | `i-lucide-search` |
| `list-pages` | 搜索中 / 已搜索 所有文档页面 | `i-lucide-search` |
| `list-examples` | 搜索中 / 已搜索 所有示例 | `i-lucide-search` |
| `get-page` | 读取中 / 已读取 `{path}` 页面 | `i-lucide-file-text` |
| `get-example` | 读取中 / 已读取 `{exampleName}` 示例 | `i-lucide-file-text` |

## API

### `useToolCall(state, toolName, input)`{lang="ts-type"}

#### 参数

::field-group
  ::field{name="state" type="ToolState"}
  工具调用状态，可判断是否已完成：`'output-available'` 表示已完成，其他值表示进行中。
  ::
  ::field{name="toolName" type="string"}
  工具名称，与 MCP 工具定义中的 `name` 字段对应。
  ::
  ::field{name="input" type="Record<string, string | undefined>"}
  工具调用的输入参数。
  ::
::

#### 返回值

::field-group
  ::field{name="toolMessage" type="Record<string, string>"}
  工具名到显示文本的映射。键为工具名，值为对应的显示文本。未匹配的工具名会回退到默认文本。
  ::
  ::field{name="toolIcon" type="Record<string, string>"}
  工具名到图标的映射。键为工具名，值为 Iconify 图标名。未匹配的工具名会回退到 `i-lucide-search`。
  ::
::

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
