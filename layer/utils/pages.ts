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
 * 检查是否存在 docs 文件夹，即 content/docs；传入 locale 时检查 content/{locale}/docs
 */
export function docsFolderExists(rootDir: string, locale?: string): boolean {
  const docsPath = locale
    ? joinURL(rootDir, 'content', locale, 'docs')
    : joinURL(rootDir, 'content', 'docs')
  return existsSync(docsPath)
}

/**
 * 检查是否存在 releases 文件，即 content/releases.{md,yml}；传入 locale 时检查 content/{locale}/releases.{md,yml}
 */
export function releasesFileExists(rootDir: string, locale?: string): boolean {
  const dir = locale ? joinURL(rootDir, 'content', locale) : joinURL(rootDir, 'content')
  return ['releases.md', 'releases.yml'].some(file => existsSync(joinURL(dir, file)))
}

/**
 * 检查是否存在 templates 文件，即 content/templates.{md,yml}；传入 locale 时检查 content/{locale}/templates.{md,yml}
 */
export function templatesFileExists(rootDir: string, locale?: string): boolean {
  const dir = locale ? joinURL(rootDir, 'content', locale) : joinURL(rootDir, 'content')
  return ['templates.md', 'templates.yml'].some(file => existsSync(joinURL(dir, file)))
}
