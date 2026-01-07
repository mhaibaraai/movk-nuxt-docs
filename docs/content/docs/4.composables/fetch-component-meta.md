---
title: fetchComponentMeta
description: 获取 Vue 组件元数据的函数。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/fetchComponentMeta.ts
---

## 概述

获取 Vue 组件的元数据，包括 Props、Emits、Slots 等信息。

```vue
<script setup lang="ts">
const { meta } = await fetchComponentMeta('UButton')

console.log(meta.props)   // Props 定义
console.log(meta.emits)   // Events 定义
console.log(meta.slots)   // Slots 定义
</script>
```

### 显示 Props 文档

```vue
<template>
  <div>
    <h2>Props</h2>
    <ul>
      <li v-for="prop in meta.props" :key="prop.name">
        <code>{{ prop.name }}</code>: {{ prop.type }}
        <p v-if="prop.description">{{ prop.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { meta } = await fetchComponentMeta('UButton')
</script>
```

## API

### `fetchComponentMeta(name)`{lang="ts-type"}

获取组件元数据。

### 参数

::field-group
  ::field{name="name" type="string" required}
  组件名称（PascalCase）。
  ::
::

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
