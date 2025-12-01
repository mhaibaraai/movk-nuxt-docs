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
    return {
      sha: commit.sha,
      date: commit.commit.author?.date ?? '',
      message: commit.commit.message?.split('\n')[0] ?? '',
      author: {
        name: commit.commit.author?.name ?? '',
        email: commit.commit.author?.email ?? '',
        login: commit.author?.login ?? '',
        avatarUrl: commit.author?.avatar_url ?? ''
      }
    }
  } catch {
    return null
  }
}, {
  maxAge: 60 * 60,
  getKey: (event) => {
    const { path } = getQuery(event)
    return `last-commit-${path}`
  }
})
