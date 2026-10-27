import { afterEach, describe, expect, it, vi } from 'vitest'
import { getGitBranch } from '../../layer/utils/git'

const BRANCH_ENV = ['CF_PAGES_BRANCH', 'CI_COMMIT_BRANCH', 'VERCEL_GIT_COMMIT_REF', 'BRANCH', 'GITHUB_HEAD_REF', 'GITHUB_REF_NAME']

describe('getGitBranch', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  function stubBranchEnv(values: Record<string, string>) {
    for (const key of BRANCH_ENV) {
      vi.stubEnv(key, values[key] ?? '')
    }
  }

  it('GitHub Actions 的 pull_request 事件使用源分支而非合并引用', () => {
    stubBranchEnv({ GITHUB_HEAD_REF: 'v3', GITHUB_REF_NAME: '369/merge' })
    expect(getGitBranch()).toBe('v3')
  })

  it('GitHub Actions 的 push 事件使用 GITHUB_REF_NAME', () => {
    stubBranchEnv({ GITHUB_REF_NAME: 'main' })
    expect(getGitBranch()).toBe('main')
  })
})
