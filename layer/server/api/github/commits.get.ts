import { Octokit } from '@octokit/rest'

export default defineCachedEventHandler(async (event) => {
  if (!process.env.NUXT_GITHUB_TOKEN) {
    return []
  }

  const { path, author } = getQuery(event) as { path: string, author?: string }
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required'
    })
  }

  const { github } = useAppConfig()
  const octokit = new Octokit({ auth: process.env.NUXT_GITHUB_TOKEN })
  const commits = await octokit.paginate(octokit.rest.repos.listCommits, {
    sha: github.branch,
    owner: github.owner,
    repo: github.name,
    path,
    since: github.since,
    per_page: github.per_page,
    until: github.until,
    ...(author && { author })
  })

  return commits.map(commit => ({
    sha: commit.sha,
    date: commit.commit.author?.date ?? '',
    message: (commit.commit.message?.split('\n')[0] ?? '')
  }))
}, {
  maxAge: 60 * 60,
  getKey: (event) => {
    const { path, author } = getQuery(event)
    return `commits-${path}${author ? `-${author}` : ''}`
  }
})
