import { describe, expect, it } from 'vitest'
import { fencedBlock, pipeTable } from '../../layer/server/utils/markdown'

describe('fencedBlock', () => {
  it('默认三个反引号并附加语言与文件名', () => {
    expect(fencedBlock('const a = 1\n', 'ts', 'a.ts')).toBe('```ts [a.ts]\nconst a = 1\n```')
  })

  it('代码含围栏时加长围栏', () => {
    expect(fencedBlock('```md\nx\n```', 'md')).toBe('````md\n```md\nx\n```\n````')
  })
})

describe('pipeTable', () => {
  const table = ['table', {},
    ['thead', {}, ['tr', {}, ['th', {}, 'Prop'], ['th', {}, 'Type']]],
    ['tbody', {},
      ['tr', {}, ['td', {}, ['code', {}, 'color']], ['td', {}, ['code', {}, '\'a\' | \'b\'']]],
      ['tr', {}, ['td', {}, 'path\\to'], ['td', {}, ['a', { href: '/x' }, ['strong', {}, 'link']]]]
    ]
  ]

  it('渲染为 GFM 管道表并转义竖线', () => {
    expect(pipeTable(table)).toBe([
      '| Prop | Type |',
      '| --- | --- |',
      '| `color` | `\'a\' \\| \'b\'` |',
      '| path\\\\to | [**link**](/x) |'
    ].join('\n'))
  })

  it('无表头返回空字符串', () => {
    expect(pipeTable(['table', {}])).toBe('')
  })
})
