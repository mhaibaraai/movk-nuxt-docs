import type { Nuxt } from '@nuxt/schema'
import { resolveModulePath } from 'exsolve'
import { getFeatures, type ResolvedFeatures } from './features'

type OptionalFeature = 'aiChat' | 'componentDocs' | 'mermaid' | 'a11y'

/** 默认关闭的功能以 optional peer 形式声明依赖，启用时由使用方安装 */
const FEATURE_PACKAGES: Record<OptionalFeature, string[]> = {
  aiChat: ['ai', '@ai-sdk/openai', '@ai-sdk/vue', '@comark/vue', '@shikijs/engine-javascript', '@shikijs/langs', '@shikijs/themes'],
  componentDocs: ['nuxt-component-meta', 'vue-component-meta', 'prettier'],
  mermaid: ['mermaid', 'dompurify'],
  a11y: ['@nuxt/a11y']
}

export interface MissingFeaturePackages {
  feature: OptionalFeature
  packages: string[]
}

export function findMissingFeaturePackages(features: ResolvedFeatures, isInstalled: (pkg: string) => boolean): MissingFeaturePackages[] {
  return (Object.keys(FEATURE_PACKAGES) as OptionalFeature[])
    .filter(feature => features[feature])
    .map(feature => ({ feature, packages: FEATURE_PACKAGES[feature].filter(pkg => !isInstalled(pkg)) }))
    .filter(entry => entry.packages.length)
}

export function formatMissingPackages(missing: MissingFeaturePackages[]): string {
  const lines = missing.map(({ feature, packages }) => `  - ${feature}: ${packages.join(', ')}`)
  const all = missing.flatMap(entry => entry.packages)
  return [
    '[@movk/nuxt-docs] 已启用的功能缺少依赖：',
    ...lines,
    `请安装后重试：pnpm add ${all.join(' ')}`
  ].join('\n')
}

/** 启用的功能缺少依赖时中止构建，避免在模块安装或打包阶段报出难以定位的错误 */
export function assertFeatureDependencies(nuxt: Nuxt): void {
  const isInstalled = (pkg: string) => Boolean(resolveModulePath(pkg, {
    from: [nuxt.options.rootDir, import.meta.url],
    try: true
  }))
  const missing = findMissingFeaturePackages(getFeatures(nuxt), isInstalled)
  if (missing.length) {
    throw new Error(formatMissingPackages(missing))
  }
}
