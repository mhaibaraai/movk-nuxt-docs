import { expect, it } from 'vitest'
import { formatComponentDocs } from '../../layer/modules/component-docs/runtime/utils/format-component-docs'

it('formats nested Vue props inside a collapsible Markdown example', async () => {
  const source = [
    '::code-collapse',
    '```vue',
    '<script setup lang="ts">',
    'const items = ref([{"label":"app","children":[{"label":"app.vue"},{"label":"nuxt.config.ts"}]}])',
    '</script>',
    '<template><MTree :items="items"/></template>',
    '```',
    '::'
  ].join('\n')

  const code = await formatComponentDocs(source, { printWidth: 70, singleQuote: true, semi: false })

  expect(code).toContain('::code-collapse')
  expect(code).toContain('const items = ref([\n  {\n    label: \'app\',')
  expect(code).toContain('<MTree :items="items" />')
})
