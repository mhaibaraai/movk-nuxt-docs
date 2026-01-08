---
title: useTheme
description: 主题定制系统管理 Composable，支持颜色、字体、圆角、图标集等全方位主题配置。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/useTheme.ts
---

## 概述

`useTheme` 提供完整的主题定制能力，允许用户动态调整站点的视觉风格，包括颜色方案、字体选择、圆角大小、图标集以及明暗模式切换。所有配置自动持久化到 localStorage。

### 主题配置项

- **颜色**：主色调和中性色配置
- **字体**：7 种预设字体系列
- **圆角**：5 种圆角半径选项
- **图标集**：Lucide / Phosphor / Tabler
- **颜色模式**：light / dark / system

## 使用示例

### 基础主题切换

```vue
<script setup lang="ts">
const { primary, neutral, mode } = useTheme()

// 切换主色
primary.value = 'blue'

// 切换中性色
neutral.value = 'zinc'

// 切换颜色模式
mode.value = 'dark'
</script>
```

### 字体和圆角定制

```vue
<script setup lang="ts">
const { font, radius, fonts, radiuses } = useTheme()

// 更改字体
font.value = 'Inter'

// 调整圆角（单位：rem）
radius.value = 0.5

// 获取所有可用选项
console.log('可用字体：', fonts)
console.log('可用圆角：', radiuses)
</script>
```

### 图标集切换

```vue
<script setup lang="ts">
const { icon, icons } = useTheme()

// 切换到 Phosphor 图标集
icon.value = 'phosphor'

// 列出所有图标集选项
console.log(icons)
// [
//   { label: 'Lucide', icon: 'i-lucide-feather', value: 'lucide' },
//   { label: 'Phosphor', icon: 'i-ph-phosphor-logo', value: 'phosphor' },
//   { label: 'Tabler', icon: 'i-tabler-brand-tabler', value: 'tabler' }
// ]
</script>
```

### 主题导出

```vue
<script setup lang="ts">
const {
  exportCSS,
  exportAppConfig,
  hasCSSChanges,
  hasAppConfigChanges
} = useTheme()

// 检查是否有自定义配置
if (hasCSSChanges.value) {
  const cssCode = exportCSS()
  console.log('CSS 配置：\n', cssCode)
}

if (hasAppConfigChanges.value) {
  const appConfigCode = exportAppConfig()
  console.log('App Config：\n', appConfigCode)
}
</script>
```

### 主题重置

```vue
<script setup lang="ts">
const { resetTheme } = useTheme()

function handleReset() {
  if (confirm('确定要重置主题到默认设置？')) {
    resetTheme()
  }
}
</script>

<template>
  <UButton @click="handleReset" color="neutral" variant="outline">
    重置主题
  </UButton>
</template>
```

### 高级：黑色主色模式

```vue
<script setup lang="ts">
const { setBlackAsPrimary } = useTheme()

// 启用黑色主色模式
// 在明亮模式下使用黑色，暗黑模式下使用白色作为主色
setBlackAsPrimary(true)
</script>
```

## API

### `useTheme()`{lang="ts-type"}

返回主题配置管理对象，包含所有主题相关的状态和操作方法。

### 返回值

::field-group

  :::field{name="primary" type="Ref<string>"}
  主色调，从 Tailwind 颜色中选择（不包含中性色）。
  :::

  :::field{name="primaryColors" type="string[]"}
  所有可用的主色选项数组。
  :::

  :::field{name="neutral" type="Ref<string>"}
  中性色，可选值：`slate` / `gray` / `zinc` / `neutral` / `stone`。
  :::

  :::field{name="neutralColors" type="string[]"}
  所有可用的中性色选项数组。
  :::

  :::field{name="radius" type="Ref<number>"}
  圆角半径（单位：rem），可选值：`0` / `0.125` / `0.25` / `0.375` / `0.5`。
  :::

  :::field{name="radiuses" type="number[]"}
  所有可用的圆角选项数组。
  :::

  :::field{name="font" type="Ref<string>"}
  字体系列，可选值：`Public Sans` / `DM Sans` / `Geist` / `Inter` / `Poppins` / `Outfit` / `Raleway`。
  :::

  :::field{name="fonts" type="string[]"}
  所有可用的字体选项数组。
  :::

  :::field{name="icon" type="Ref<string>"}
  图标集，可选值：`lucide` / `phosphor` / `tabler`。
  :::

  :::field{name="icons" type="Array<{ label: string; icon: string; value: string }>"}
  所有可用的图标集选项，每项包含标签、图标类名和值。
  :::

  :::field{name="mode" type="Ref<'light' | 'dark' | 'system'>"}
  颜色模式，支持明亮、暗黑和跟随系统三种模式。
  :::

  :::field{name="modes" type="Array<{ label: string; icon: string }>"}
  所有颜色模式选项，包含标签和对应图标。
  :::

  :::field{name="setBlackAsPrimary" type="(value: boolean) => void"}
  设置是否使用黑色作为主色（明亮模式黑色，暗黑模式白色）。
  :::collapsible
    ::field-group
      ::field{name="value" type="boolean" required}
      是否启用黑色主色模式。
      ::
    ::
  :::
  :::

  :::field{name="hasCSSChanges" type="Ref<boolean>"}
  计算属性，判断是否有 CSS 相关的自定义配置（圆角、字体、黑色主色）。
  :::

  :::field{name="hasAppConfigChanges" type="Ref<boolean>"}
  计算属性，判断是否有 App Config 相关的自定义配置（主色、中性色、图标集）。
  :::

  :::field{name="exportCSS" type="() => string"}
  导出当前主题的 CSS 配置代码，包含 Tailwind CSS 变量声明。
  :::

  :::field{name="exportAppConfig" type="() => string"}
  导出当前主题的 `app.config.ts` 配置代码。
  :::

  :::field{name="resetTheme" type="() => void"}
  重置所有主题设置到默认值，并清除 localStorage 中的持久化数据。
  :::

::

## 持久化机制

所有主题配置会自动保存到 localStorage，键名格式为 `{站点名称}-ui-{配置项}`：

- `{站点名称}-ui-primary`：主色配置
- `{站点名称}-ui-neutral`：中性色配置
- `{站点名称}-ui-radius`：圆角配置
- `{站点名称}-ui-font`：字体配置
- `{站点名称}-ui-icons`：图标集配置
- `{站点名称}-ui-black-as-primary`：黑色主色模式

## Analytics 集成

当启用 Vercel Analytics 的 debug 模式时，所有主题变更都会被追踪：

```ts
// 主题变更事件示例
track('Theme Changed', {
  setting: 'primary',
  value: 'blue'
})

track('Theme Exported', {
  type: 'css'
})

track('Theme Reset')
```

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
