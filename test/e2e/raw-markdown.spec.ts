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

// 提交历史链接中的分支随构建环境变化，比对前统一替换
const COMMITS_BRANCH = /(\/commits\/).+?(\/layer\/)/g

for (const page of PAGES) {
  test(`raw markdown: ${page}`, async ({ request }) => {
    const response = await request.get(`/raw/docs/${page}.md`)
    expect(response.status()).toBe(200)
    const text = (await response.text()).replace(COMMITS_BRANCH, '$1{branch}$2')
    expect(text).toMatchSnapshot(`${page.replace('/', '-')}.md`)
  })
}
