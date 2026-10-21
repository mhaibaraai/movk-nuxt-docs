import { describe, expect, it } from 'vitest'
import { buildComponentNameCandidates, normalizeComponentName } from '../../layer/server/utils/normalizeComponentName'

describe('normalizeComponentName', () => {
  it('生成展示名、元数据名与路径名候选', () => {
    expect(buildComponentNameCandidates(' button-group.vue ')).toEqual({
      displayNames: ['button-group', 'ButtonGroup'],
      metaNames: ['button-group', 'ButtonGroup'],
      pathNames: ['button-group']
    })
  })

  it('PascalCase 输入不重复', () => {
    expect(buildComponentNameCandidates('ButtonGroup').displayNames).toEqual(['ButtonGroup'])
  })

  it('优先使用 fallback 名称', () => {
    expect(normalizeComponentName('x', 'ComponentProps.vue')).toBe('ComponentProps')
    expect(normalizeComponentName('Accordion')).toBe('Accordion')
  })
})
