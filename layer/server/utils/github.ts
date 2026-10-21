import { Octokit } from '@octokit/rest'
import type { H3Event } from 'h3'

export interface GitHubConfig {
  owner?: string
  name?: string
  url?: string
  branch?: string
  rootDir?: string
  commitPath?: string
  suffix?: string
  since?: string
  until?: string
  perPage?: number
  dateFormat?: {
    locale?: string
    options?: Intl.DateTimeFormatOptions
  }
}

/** 读取 appConfig.github；关闭或缺少 owner / name 时返回 null */
export function useGitHubConfig(): (GitHubConfig & { owner: string, name: string }) | null {
  const { github } = useAppConfig()
  if (!github || typeof github === 'boolean' || !github.owner || !github.name) {
    return null
  }
  return github as GitHubConfig & { owner: string, name: string }
}

/**
 * 统一创建 Octokit，令牌取自 runtimeConfig.githubToken（环境变量 NUXT_GITHUB_TOKEN）。
 * `requireToken` 为 true 且未配置令牌时返回 null，调用方据此降级
 */
export function useOctokit(event?: H3Event, { requireToken = false } = {}): Octokit | null {
  const token = useRuntimeConfig(event).githubToken
  if (requireToken && !token) {
    return null
  }
  return new Octokit({ auth: token || undefined, request: { timeout: 10_000 } })
}
