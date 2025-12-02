import { Octokit } from '@octokit/rest'

export default defineCachedEventHandler(async (event) => {
  if (!process.env.NUXT_GITHUB_TOKEN) {
    return null
  }

  const { path } = getQuery(event) as { path: string }
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required'
    })
  }

  const { github } = useAppConfig()
  const octokit = new Octokit({ auth: process.env.NUXT_GITHUB_TOKEN })

  try {
    const { data: commits } = await octokit.rest.repos.listCommits({
      sha: github.branch,
      owner: github.owner,
      repo: github.name,
      path,
      per_page: 1
    })

    if (!commits.length) {
      return null
    }

    const commit = commits[0]

    // 获取提交者信息，处理 web-flow 场景（PR squash merge）
    let authorName = commit.commit.author?.name ?? ''
    let authorLogin = commit.author?.login ?? ''
    let authorAvatar = commit.author?.avatar_url ?? ''
    let commitUrl = commit.html_url

    // 如果提交者是 web-flow，尝试获取实际的 PR 作者
    if (authorLogin === 'web-flow') {
      try {
        // 从 squash commit message 中提取 PR 编号 (#166)
        const prMatch = commit.commit.message.match(/#(\d+)/)
        if (prMatch?.[1]) {
          const { data: prData } = await octokit.rest.pulls.get({
            owner: github.owner,
            repo: github.name,
            pull_number: Number.parseInt(prMatch[1])
          })

          authorLogin = prData.user?.login ?? authorLogin
          authorAvatar = prData.user?.avatar_url ?? authorAvatar
          authorName = prData.user?.name || authorLogin
          commitUrl = prData.html_url
        }
      } catch {
        // 获取 PR 信息失败时忽略，使用原始提交者信息
      }
    }

    // 格式化日期
    const date = commit.commit.author?.date ?? ''
    const dateFormat = github.dateFormat ?? {}
    const locale = dateFormat.locale ?? 'zh-CN'
    const formatOptions: Intl.DateTimeFormatOptions = dateFormat.options ?? {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    const dateFormatted = date
      ? new Date(date).toLocaleDateString(locale, formatOptions)
      : ''

    return {
      sha: commit.sha,
      date,
      dateFormatted,
      message: commit.commit.message?.split('\n')[0] ?? '',
      url: commitUrl,
      author: {
        name: authorName,
        login: authorLogin,
        avatar: authorAvatar
      }
    }
  } catch {
    return null
  }
}, {
  maxAge: 60 * 60, // 缓存 1 小时
  getKey: (event) => {
    const { path } = getQuery(event)
    return `last-commit-${path}`
  }
})
