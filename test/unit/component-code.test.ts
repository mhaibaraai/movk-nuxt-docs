import { describe, expect, it } from 'vitest'
import { generateComponentCode } from '../../layer/shared/component-code'

describe('generateComponentCode', () => {
  it('无属性时输出自闭合标签', () => {
    expect(generateComponentCode({ name: 'UBadge', props: {} })).toBe('<template>\n  <UBadge />\n</template>')
  })

  it('按类型输出属性，跳过空值与 hide', () => {
    const code = generateComponentCode({
      name: 'UButton',
      props: { label: 'Hi', size: 2, block: true, disabled: false, ui: { base: 'x' }, empty: '', none: null, color: 'primary' },
      hide: ['color']
    })
    expect(code).toBe(`<template>\n  <UButton label="Hi" :size="2" block :disabled="false" :ui='{"base":"x"}' />\n</template>`)
  })

  it('modelValue 与 model 生成 v-model，external 生成 ref 声明', () => {
    const code = generateComponentCode({
      name: 'UInput',
      props: { modelValue: 'a', open: true, items: [1, 2] },
      model: ['open'],
      external: ['modelValue', 'items', 'missing']
    })
    expect(code).toBe([
      '<script setup lang="ts">',
      'const value = ref("a")',
      'const items = ref([1,2])',
      '</script>',
      '',
      '<template>',
      '  <UInput v-model="value" v-model:open="open" :items="items" />',
      '</template>'
    ].join('\n'))
  })

  it('插槽内容按层级缩进，忽略空插槽', () => {
    const code = generateComponentCode({
      name: 'UCard',
      props: {},
      slots: { default: 'Body\nMore', header: 'Title', footer: '  ' }
    })
    expect(code).toBe([
      '<template>',
      '  <UCard>',
      '    Body',
      '    More',
      '  ',
      '    <template #header>',
      '      Title',
      '    </template></UCard>',
      '</template>'
    ].join('\n'))
  })

  it('提供 getDefault 时省略与默认值相同的布尔与字符串属性', () => {
    const defaults: Record<string, unknown> = { block: '`true`', loading: undefined, color: 'primary' }
    const code = generateComponentCode({
      name: 'UButton',
      props: { block: true, loading: false, color: 'primary', variant: 'solid', square: true },
      getDefault: key => defaults[key]
    })
    expect(code).toBe('<template>\n  <UButton variant="solid" square />\n</template>')
  })

  it('非字符串插槽内容转为字符串', () => {
    expect(generateComponentCode({ name: 'UKbd', props: {}, slots: { default: 1 } }))
      .toBe('<template>\n  <UKbd>\n    1\n  </UKbd>\n</template>')
  })
})
