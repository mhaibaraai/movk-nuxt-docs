import { Octokit } from '@octokit/rest'

export default defineCachedEventHandler(async (event) => {
  if (!process.env.NUXT_GITHUB_TOKEN) {
    return []
  }

  const { path, author } = getQuery(event) as { path: string | string[], author: string }
  const paths = Array.isArray(path) ? path : [path]

  if (!paths.length || !paths[0]) {
    throw createError({
      status: 400,
      statusText: 'Path is required'
    })
  }

  const { github } = useAppConfig()

  if (!github || typeof github === 'boolean') {
    throw createError({
      status: 500,
      statusText: 'GitHub configuration is not available'
    })
  }

  const octokit = new Octokit({
    auth: process.env.NUXT_GITHUB_TOKEN,
    request: { timeout: 10_000 }
  })

  const allCommits = await Promise.all(
    paths.map(path =>
      octokit.rest.repos.listCommits({
        sha: github.branch,
        owner: github.owner,
        repo: github.name,
        path,
        since: github.since,
        per_page: github.per_page || 100,
        until: github.until,
        author
      }).then(res => res.data).catch(() => [])
    )
  )

  const uniqueCommits = new Map<string, { sha: string, date: string, message: string }>()
  for (const commits of allCommits) {
    for (const commit of commits) {
      if (!uniqueCommits.has(commit.sha)) {
        uniqueCommits.set(commit.sha, {
          sha: commit.sha,
          date: commit.commit.author?.date ?? '',
          message: (commit.commit.message?.split('\n')[0] ?? '')
        })
      }
    }
  }

  return Array.from(uniqueCommits.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}, {
  maxAge: 60 * 60,
  getKey: (event) => {
    const { path, author } = getQuery(event)
    const paths = Array.isArray(path) ? path : [path]
    return `commits-${paths.join(',')}${author ? `-${author}` : ''}`
  },
  shouldBypassCache: () => !useRuntimeConfig().githubToken
})
