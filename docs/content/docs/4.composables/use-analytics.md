---
title: useAnalytics
description: Vercel Analytics 事件追踪 Composable。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/useAnalytics.ts
---

## 概述

### 启用 Analytics

在 `app.config.ts` 中配置：

```ts [app.config.ts]
export default defineAppConfig({
  vercelAnalytics: {
    debug: true  // 开发环境启用日志
  }
})
```

## 使用示例

### 追踪按钮点击

```vue
<script setup lang="ts">
const { track } = useAnalytics()

function handleCTAClick() {
  track('CTA Clicked', {
    location: 'hero',
    label: 'Get Started'
  })

  navigateTo('/docs')
}
</script>

<template>
  <UButton @click="handleCTAClick">
    Get Started
  </UButton>
</template>
```

### 内置事件追踪

ThemePicker 组件已集成 Analytics：

```ts
// 主题选择器打开
track('Theme Picker Opened')

// 主题设置变更
track('Theme Changed', {
  setting: 'primary',
  value: 'blue'
})

// 主题导出
track('Theme Exported', {
  type: 'css'
})

// 主题重置
track('Theme Reset')
```

### 条件追踪

```vue
<script setup lang="ts">
const appConfig = useAppConfig()
const { track } = useAnalytics()

function conditionalTrack(event: string, properties?: any) {
  if (appConfig.vercelAnalytics?.debug) {
    track(event, properties)
  }
}
</script>
```

## API

### `useAnalytics()`{lang="ts-type"}

提供 Vercel Analytics 事件追踪，用于监控用户行为和站点性能。

### 返回值

::field-group

  :::field{name="track" type="(event: string, properties?: Record<string, any>) => void"}
  一个函数，用于追踪事件。接受事件名称和可选的事件属性对象。
  :::collapsible
    ::field-group
      ::field{name="event" type="string" required}
      事件名称。
      ::

      ::field{name="properties" type="Record<string, any>"}
      可选的事件属性对象。
      ::
    ::
  :::
  :::

::

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
