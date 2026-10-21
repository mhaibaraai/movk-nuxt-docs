import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { docsFolderExists, landingPageExists, releasesFileExists, templatesFileExists } from '../../layer/utils/pages'

function site(files: string[]): string {
  const root = mkdtempSync(join(tmpdir(), 'movk-site-'))
  for (const file of files) {
    const path = join(root, file)
    if (file.endsWith('/')) {
      mkdirSync(path, { recursive: true })
      continue
    }
    mkdirSync(join(path, '..'), { recursive: true })
    writeFileSync(path, '')
  }
  return root
}

describe('pages 探测', () => {
  it('landing page 与 docs 目录', () => {
    const root = site(['app/pages/index.vue', 'content/docs/', 'content/en/docs/'])
    expect(landingPageExists(root)).toBe(true)
    expect(docsFolderExists(root)).toBe(true)
    expect(docsFolderExists(root, 'en')).toBe(true)
    expect(docsFolderExists(root, 'ja')).toBe(false)
  })

  it('releases / templates 支持 md 与 yml', () => {
    const root = site(['content/releases.yml', 'content/en/templates.md'])
    expect(releasesFileExists(root)).toBe(true)
    expect(releasesFileExists(root, 'en')).toBe(false)
    expect(templatesFileExists(root)).toBe(false)
    expect(templatesFileExists(root, 'en')).toBe(true)
  })

  it('空站点全部为 false', () => {
    const root = site([])
    expect([landingPageExists(root), docsFolderExists(root), releasesFileExists(root), templatesFileExists(root)]).toEqual([false, false, false, false])
  })
})
