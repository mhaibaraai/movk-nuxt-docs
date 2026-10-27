import { describe, expect, it } from 'vitest'
import { syncCodeGroups } from '../../layer/utils/code-groups'

const pre = (filename: string, language = 'bash') => ['pre', { filename, language, code: filename }]

describe('syncCodeGroups', () => {
  it('包管理器代码组补 sync 并按统一顺序排列', () => {
    const tree = [['code-group', {}, pre('npm'), pre('yarn'), pre('pnpm')]]
    expect(syncCodeGroups(tree)).toEqual([
      ['code-group', { sync: 'package-manager' }, pre('pnpm'), pre('npm'), pre('yarn')]
    ])
  })

  it('TS / JS 代码组按语言同步，TypeScript 在前', () => {
    const tree = [['code-group', {}, pre('nuxt.config.js', 'js'), pre('nuxt.config.ts', 'ts')]]
    expect(syncCodeGroups(tree)).toEqual([
      ['code-group', { sync: 'language' }, pre('nuxt.config.ts', 'ts'), pre('nuxt.config.js', 'js')]
    ])
  })

  it('已声明 sync 或无法识别的代码组保持不变', () => {
    const custom = ['code-group', { sync: 'custom' }, pre('npm'), pre('pnpm')]
    const mixed = ['code-group', {}, pre('pnpm'), pre('.env')]
    expect(syncCodeGroups([custom, mixed])).toEqual([custom, mixed])
  })

  it('递归处理嵌套在其他组件中的代码组且不修改原树', () => {
    const group = ['code-group', {}, pre('yarn'), pre('pnpm')]
    const tree = [['tabs', {}, ['tabs-item', { label: 'A' }, group]], 'text']
    const result = syncCodeGroups(tree)
    expect(result).toEqual([['tabs', {}, ['tabs-item', { label: 'A' }, ['code-group', { sync: 'package-manager' }, pre('pnpm'), pre('yarn')]]], 'text'])
    expect(group[1]).toEqual({})
  })
})
