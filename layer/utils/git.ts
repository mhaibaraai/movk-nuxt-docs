import { execSync } from 'node:child_process'
import gitUrlParse from 'git-url-parse'
import { readGitConfig } from 'pkg-types'

export interface GitInfo {
  name: string
  owner: string
  url: string
}

export function getGitBranch(): string {
  const env = process.env
  const fromEnv = env.CF_PAGES_BRANCH || env.CI_COMMIT_BRANCH || env.VERCEL_GIT_COMMIT_REF || env.BRANCH || env.GITHUB_REF_NAME
  if (fromEnv && fromEnv !== 'HEAD') return fromEnv

  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    if (branch && branch !== 'HEAD') return branch
  } catch { console.warn('Failed to get git branch from command line') }

  return 'main'
}

export async function getLocalGitInfo(rootDir: string): Promise<GitInfo | undefined> {
  try {
    const config = await readGitConfig(rootDir)
    const remote = config?.remote?.origin?.url
    if (!remote) return

    const { name, owner, source } = gitUrlParse(remote)
    return { name, owner, url: `https://${source}/${owner}/${name}` }
  } catch { console.warn('Failed to get local git info') }
}

export function getGitEnv(): GitInfo {
  const env = process.env

  const owner = env.VERCEL_GIT_REPO_OWNER || env.GITHUB_REPOSITORY_OWNER || env.CI_PROJECT_PATH?.split('/').shift() || ''
  const name = env.VERCEL_GIT_REPO_SLUG || env.GITHUB_REPOSITORY?.split('/').pop() || env.CI_PROJECT_PATH?.split('/').slice(1).join('/') || ''
  const provider = env.VERCEL_GIT_PROVIDER || (env.GITHUB_SERVER_URL ? 'github' : '')
  let url = env.REPOSITORY_URL || ''

  if (!url && provider && owner && name) {
    url = `https://${provider}.com/${owner}/${name}`
  }

  if (!name && !owner && url) {
    try {
      const parsed = gitUrlParse(url)
      return { name: parsed.name, owner: parsed.owner, url }
    } catch { console.warn('Failed to parse git URL') }
  }

  return { name, owner, url }
}
