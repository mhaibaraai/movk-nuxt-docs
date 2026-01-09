---
title: useToolCall
description: AI 聊天工具定义 Composable，用于配置工具调用的显示标签。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/useToolCall.ts
---

## 概述

`useToolCall` 提供 AI 聊天功能中可用的工具定义。当 AI 助手调用工具时，会根据此配置显示相应的标签信息，提升用户体验。

工具定义支持两种形式：
- **静态字符串**：直接显示固定文本
- **动态函数**：根据工具参数生成描述文本

## 使用示例

### 在 AI 聊天组件中使用

```vue
<script setup lang="ts">
const { tools } = useToolCall()

function getToolLabel(toolName: string, args?: any): string {
  const label = tools[toolName]

  if (!label) {
    return toolName
  }

  return typeof label === 'function' ? label(args) : label
}

// 示例：获取工具标签
console.log(getToolLabel('list-pages'))
// 输出：列出所有文档页面

console.log(getToolLabel('get-page', { path: '/docs/api' }))
// 输出：检索 /docs/api
</script>
```

### 扩展工具定义

如果需要自定义工具定义，可以在应用层覆盖此 composable：

```ts [composables/useToolCall.ts]
export function useToolCall() {
  const tools: Record<string, string | ((args: any) => string)> = {
    // 静态工具标签
    'list-pages': '列出所有文档页面',
    'search-docs': '搜索文档内容',

    // 动态工具标签
    'get-page': (args: any) => `检索 ${args?.path || '页面'}`,
    'update-content': (args: any) => {
      const action = args?.action || '更新'
      const target = args?.target || '内容'
      return `${action}${target}`
    }
  }

  return {
    tools
  }
}
```

## API

### `useToolCall()`{lang="ts-type"}

返回工具定义对象，包含所有可用的 AI 工具及其显示标签。

### 返回值

::field-group
  ::field{name="tools" type="Record<string, string | ((args: any) => string)>"}
  工具定义映射对象，键为工具名称，值可以是：
  - **字符串**：直接显示的静态标签
  - **函数**：接收工具参数并返回动态标签的函数
  ::
::

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
