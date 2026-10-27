import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildReference, TARGETS } from '../../scripts/config-reference/generate'
import { collectGroups, renderGroups, replaceRegion } from '../../scripts/config-reference/render'

const schema = {
  properties: {
    icon: { type: 'object', properties: { size: { type: 'string' } } },
    toc: {
      type: 'object',
      description: '目录配置',
      properties: {
        title: { type: 'string', title: '目录标题', default: '' },
        bottom: {
          type: 'object',
          properties: { links: { type: 'array', description: '底部链接 | 按钮', default: [] } }
        }
      }
    }
  }
}

describe('config reference', () => {
  it('展开嵌套对象并排除其他模块的分组', () => {
    const groups = collectGroups(schema, 'zh-CN', {})
    expect(groups.map(group => group.key)).toEqual(['toc'])
    expect(groups[0]!.rows).toEqual([
      { path: 'toc.title', type: 'string', default: '', description: '目录标题' },
      { path: 'toc.bottom.links', type: 'array', default: [], description: '底部链接 | 按钮' }
    ])
  })

  it('英文缺少说明时报错', () => {
    expect(() => collectGroups(schema, 'en', { 'toc': 'TOC', 'toc.title': 'Title' })).toThrow('appConfig.toc.bottom.links')
  })

  it('渲染表格并转义竖线', () => {
    const markdown = renderGroups(collectGroups(schema, 'zh-CN', {}), 'zh-CN')
    expect(markdown).toContain('| `toc.bottom.links` | `array` | `[]` | 底部链接 \\| 按钮 |')
  })

  it('只替换标记区域', () => {
    const content = 'intro\n<!-- config-reference:start -->\nold\n<!-- config-reference:end -->\noutro'
    expect(replaceRegion(content, 'new')).toBe('intro\n<!-- config-reference:start -->\n\nnew\n\n<!-- config-reference:end -->\noutro')
  })

  it.each(Object.entries(TARGETS))('%s 文档与 schema 一致（不一致时运行 pnpm docs:reference）', (locale, file) => {
    expect(readFileSync(file, 'utf8')).toBe(buildReference(locale as keyof typeof TARGETS))
  })
})
