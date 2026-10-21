import type { Nuxt } from '@nuxt/schema'
import { relative } from 'pathe'

/**
 * 将关闭的功能目录移出生成的 tsconfig：layer 源码随包发布，使用方类型检查时
 * 未安装的可选依赖（如 ai、prettier）不应导致其失败
 */
export function excludeFeatureTypes(nuxt: Nuxt, dirs: string[]): void {
  if (!dirs.length) return

  const patterns = (from: string) => dirs.flatMap((dir) => {
    const path = relative(from, dir)
    return [path, `${path}/**/*`]
  })

  nuxt.hook('prepare:types', ({ tsConfig }) => {
    tsConfig.exclude = [...(tsConfig.exclude || []), ...patterns(nuxt.options.buildDir)]
  })

  nuxt.hook('nitro:init', (nitro) => {
    nitro.hooks.hook('types:extend', (types) => {
      types.tsConfig ||= {}
      types.tsConfig.exclude = [...(types.tsConfig.exclude || []), ...patterns(nuxt.options.buildDir)]
    })
  })
}
