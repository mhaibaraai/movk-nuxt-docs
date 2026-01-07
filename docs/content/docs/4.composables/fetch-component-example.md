---
title: fetchComponentExample
description: 获取组件示例代码的函数。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/fetchComponentExample.ts
---

## 概述

获取组件的示例代码。

```vue
<script setup lang="ts">
const example = await fetchComponentExample('UButton')

console.log(example.code)        // 示例代码
console.log(example.description) // 示例说明
</script>
```

### 显示代码示例

```vue
<template>
  <div>
    <h3>{{ example.title }}</h3>
    <p>{{ example.description }}</p>

    <UCodeBlock
      :code="example.code"
      language="vue"
    />
  </div>
</template>

<script setup lang="ts">
const example = await fetchComponentExample('UButton')
</script>
```

## API

### `fetchComponentExample(name)`{lang="ts-type"}

获取组件示例代码。

### 参数

::field-group
  ::field{name="name" type="string" required}
  组件示例名称（PascalCase）。
  ::
::

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
