---
title: Accordion
description: 本示例将向您展示如何运用 `component-example` 组件，创建一个具有交互功能的手风琴（Accordion）组件，并支持代码高亮和折叠等高级功能。
category: example
---

## 用法

使用 `:component-example` 指令可以轻松创建可交互的组件示例。该指令会自动生成组件预览、源代码展示，并支持代码高亮和折叠功能。

::code-preview

:::component-example
---
name: AccordionExample
highlights: [3, 7]
collapse: true
options:
  - name: 'type'
    label: 'type'
    items:
      - 'multiple'
      - 'single'
    default: 'single'
  - name: 'trailingIcon'
    label: 'trailingIcon'
    default: 'i-lucide:arrow-down'
props:
  class: 'p-4'
  defaultValue: '1'
---
:::

#code

```mdc
:::component-example
---
name: AccordionExample
highlights: [3, 7]
collapse: true
options:
  - name: 'type'
    label: 'type'
    items:
      - 'multiple'
      - 'single'
    default: 'single'
  - name: 'trailingIcon'
    label: 'trailingIcon'
    default: 'i-lucide:arrow-down'
props:
  class: 'p-4'
  defaultValue: '1'
---
:::
```
::
