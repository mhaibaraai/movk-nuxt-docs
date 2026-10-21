import { describe, expect, it } from 'vitest'
import { resolveCommitFilePath } from '../../layer/shared/commit-path'

const base = { basePath: 'src', suffix: 'ts', name: 'use-header' }

describe('resolveCommitFilePath', () => {
  it('auto：vue 文件用 PascalCase，其余用 camelCase', () => {
    expect(resolveCommitFilePath({ ...base, casing: 'auto' })).toBe('src/useHeader.ts')
    expect(resolveCommitFilePath({ ...base, name: 'component-props', suffix: 'vue', casing: 'auto' })).toBe('src/ComponentProps.vue')
  })

  it('显式命名格式', () => {
    expect(resolveCommitFilePath({ ...base, name: 'useHeader', casing: 'kebab' })).toBe('src/use-header.ts')
    expect(resolveCommitFilePath({ ...base, casing: 'camel' })).toBe('src/useHeader.ts')
    expect(resolveCommitFilePath({ ...base, casing: 'pascal' })).toBe('src/UseHeader.ts')
  })

  it('带前缀目录', () => {
    expect(resolveCommitFilePath({ ...base, prefix: 'composables', casing: 'auto' })).toBe('src/composables/useHeader.ts')
  })
})
