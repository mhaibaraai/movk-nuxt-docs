import { Octokit } from '@octokit/rest'

export interface Release {
  tag: string
  /** 发布名称，未命名时为 tag */
  title: string
  date: string
  url: string
  prerelease: boolean
  /** GitHub 原样存储的发布说明 Markdown */
  markdown: string
}

export type ReleaseSummary = Omit<Release, 'markdown'>

/**
 * 从 GitHub API 获取 appConfig.github 所指仓库的全部发布，按发布时间倒序，排除草稿。
 * 结果缓存 1 小时，由列表接口与单版本接口共用，同一时段内只请求 GitHub 一次；
 * 未配置 NUXT_GITHUB_TOKEN 时以匿名方式请求（每 IP 每小时 60 次，缓存下足够）
 */
export const fetchReleases = defineCachedFunction(async (): Promise<Release[]> => {
  const repo = getGitHubRepo()
  if (!repo) {
    return []
  }

  const octokit = new Octokit({ auth: process.env.NUXT_GITHUB_TOKEN || undefined })
  const releases = await octokit.paginate(octokit.rest.repos.listReleases, { ...repo, per_page: 100 })

  return releases
    .filter(release => !release.draft && release.published_at)
    .map(release => ({
      tag: release.tag_name,
      title: release.name || release.tag_name,
      date: release.published_at!,
      url: release.html_url,
      prerelease: release.prerelease,
      markdown: release.body || ''
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}, {
  maxAge: 60 * 60,
  name: 'github-releases',
  getKey: () => {
    const repo = getGitHubRepo()
    return repo ? `${repo.owner}-${repo.repo}` : 'none'
  }
})

function getGitHubRepo(): { owner: string, repo: string } | null {
  const { github } = useAppConfig()
  if (!github || typeof github === 'boolean' || !github.owner || !github.name) {
    return null
  }
  return { owner: github.owner, repo: github.name }
}
