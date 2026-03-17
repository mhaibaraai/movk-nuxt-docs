import { Octokit } from '@octokit/rest'

export default defineCachedEventHandler(async () => {
  if (!process.env.NUXT_GITHUB_TOKEN) {
    return []
  }

  const { github } = useAppConfig()

  if (!github || typeof github === 'boolean') {
    throw createError({
      status: 500,
      statusText: 'GitHub configuration is not available'
    })
  }

  const octokit = new Octokit({ auth: process.env.NUXT_GITHUB_TOKEN })

  const releases = await octokit.rest.repos.listReleases({
    owner: github.owner,
    repo: github.name
  }).then(res => res.data).catch(() => [])

  return releases
}, {
  maxAge: 60 * 60,
  getKey: () => 'releases',
  shouldBypassCache: () => !useRuntimeConfig().githubToken
})
