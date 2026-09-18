import type { Release } from '../../../utils/releases'

/** 单个发布及其说明正文 */
export default defineCachedEventHandler(async (event): Promise<Release> => {
  const tag = getRouterParam(event, 'tag')
  const release = (await fetchReleases()).find(entry => entry.tag === tag)
  if (!release) {
    throw createError({ statusCode: 404, statusMessage: 'Release not found' })
  }
  return release
}, {
  maxAge: 60 * 60,
  // Nitro 会从自定义键中剔除非单词字符，v2.1.10 与 v2.11.0 会因此冲突，下划线则会保留
  getKey: event => `release-${getRouterParam(event, 'tag')?.replace(/\W/g, '_')}`
})
