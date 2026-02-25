import { existsSync } from 'node:fs'
import { joinURL } from 'ufo'

/**
 * 检查是否存在 landing page，即 app/pages/index.vue 文件
 */
export function landingPageExists(rootDir: string): boolean {
  const vueLandingPath = joinURL(rootDir, 'app', 'pages', 'index.vue')
  return existsSync(vueLandingPath)
}

/**
 * 检查是否存在 docs 文件夹，即 content/docs
 */
export function docsFolderExists(rootDir: string): boolean {
  const docsPath = joinURL(rootDir, 'content', 'docs')
  return existsSync(docsPath)
}

/**
 * 检查是否存在 releases 文件，即 content/releases.md 或 content/releases.yml
 */
export function releasesFileExists(rootDir: string): boolean {
  return ['releases.md', 'releases.yml'].some(file =>
    existsSync(joinURL(rootDir, 'content', file))
  )
}
