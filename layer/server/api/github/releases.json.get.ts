import type { ReleaseSummary } from '../../utils/releases'

/** 全部发布（不含说明正文），按发布时间倒序；正文由 releases/[tag] 按版本提供 */
export default defineCachedEventHandler(async (): Promise<ReleaseSummary[]> => {
  // 失败时直接抛出：返回空数组会被缓存 1 小时，调用方自行降级
  const releases = await fetchReleases()
  return releases.map(({ markdown: _markdown, ...release }) => release)
}, {
  maxAge: 60 * 60,
  getKey: () => 'releases-list'
})
