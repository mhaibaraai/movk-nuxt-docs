import { expect, test } from '@playwright/test'

// transformMDC 的特征测试：组件文档转为纯 Markdown 的输出须保持稳定，重构前后用快照比对
const PAGES = [
  'components/component-props',
  'components/component-slots',
  'components/component-emits',
  'components/component-example',
  'components/component-code',
  'components/commit-changelog',
  'components/page-last-commit',
  'writing/mdc-components',
  'writing/code-blocks'
]

for (const page of PAGES) {
  test(`raw markdown: ${page}`, async ({ request }) => {
    const response = await request.get(`/raw/docs/${page}.md`)
    expect(response.status()).toBe(200)
    expect(await response.text()).toMatchSnapshot(`${page.replace('/', '-')}.md`)
  })
}
