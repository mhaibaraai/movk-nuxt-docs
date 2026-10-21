import { describe, expect, it } from 'vitest'
import { filterReleases, prepareReleaseNotes, releasePath, releasesNavigation, unwrapHeadingLinks } from '../../layer/app/utils/releases'
import type { ReleaseSummary } from '../../layer/app/utils/releases'

const release = (tag: string, prerelease = false): ReleaseSummary => ({ tag, title: tag, date: '', url: '', prerelease })
const releases = [release('v2.1.0'), release('v2.0.0-beta.1', true), release('v2.0.0'), release('v1.9.0')]

describe('releases', () => {
  it('过滤预发布与 tag 正则', () => {
    expect(filterReleases(releases).map(r => r.tag)).toEqual(['v2.1.0', 'v2.0.0', 'v1.9.0'])
    expect(filterReleases(releases, { prerelease: true, include: '^v2' })).toHaveLength(3)
  })

  it('最新版本在根路径', () => {
    expect(releasePath(releases, 'v2.1.0')).toBe('/releases')
    expect(releasePath(releases, 'v1.9.0')).toBe('/releases/v1.9.0')
  })

  it('按主版本分组导航', () => {
    const nav = releasesNavigation(releases, path => `/en${path}`)
    expect(nav.map(group => group.title)).toEqual(['v2.x', 'v1.x'])
    expect(nav[0]!.children![0]).toMatchObject({ path: '/en/releases', exact: true })
    expect(nav[1]!.children![0]).toMatchObject({ path: '/en/releases/v1.9.0', exact: false })
  })

  it('解开标题中的链接', () => {
    const tree = { type: 'root', children: [{ type: 'element', tag: 'h2', children: [{ type: 'element', tag: 'a', children: [{ type: 'text', value: '2.0' }] }] }] }
    expect(unwrapHeadingLinks(tree).children![0]!.children).toEqual([{ type: 'text', value: '2.0' }])
  })

  it('发布说明：@提及转链接，保护代码与已有链接，转义大写标签', () => {
    expect(prepareReleaseNotes('thanks @octocat and `@scope/pkg` [@a](https://x)')).toBe('thanks [@octocat](https://github.com/octocat) and `@scope/pkg` [@a](https://x)')
    expect(prepareReleaseNotes('set <PROVIDER>_BASE_URL')).toBe('set &lt;PROVIDER>_BASE_URL')
    expect(prepareReleaseNotes('email a@b.com')).toBe('email a@b.com')
  })
})
