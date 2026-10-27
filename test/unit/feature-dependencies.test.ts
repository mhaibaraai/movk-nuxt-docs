import { describe, expect, it } from 'vitest'
import { findMissingFeaturePackages, formatMissingPackages } from '../../layer/utils/feature-dependencies'
import { resolveFeatures } from '../../layer/utils/features'

const installed = (names: string[]) => (pkg: string) => names.includes(pkg)

describe('findMissingFeaturePackages', () => {
  it('默认功能无需额外依赖', () => {
    expect(findMissingFeaturePackages(resolveFeatures({}, {}), installed([]))).toEqual([])
  })

  it('按启用的功能列出缺失依赖', () => {
    const features = resolveFeatures({ componentDocs: true, a11y: true }, { enabled: true })
    const missing = findMissingFeaturePackages(features, installed(['ai', 'prettier']))
    expect(missing).toEqual([
      { feature: 'aiChat', packages: ['@ai-sdk/openai', '@ai-sdk/vue', '@comark/vue', '@shikijs/engine-javascript', '@shikijs/langs', '@shikijs/themes'] },
      { feature: 'componentDocs', packages: ['nuxt-component-meta', 'vue-component-meta'] },
      { feature: 'a11y', packages: ['@nuxt/a11y'] }
    ])
  })

  it('格式化为可直接执行的安装命令', () => {
    const message = formatMissingPackages([
      { feature: 'mermaid', packages: ['mermaid', 'dompurify'] },
      { feature: 'a11y', packages: ['@nuxt/a11y'] }
    ])
    expect(message).toContain('mermaid: mermaid, dompurify')
    expect(message).toContain('pnpm add mermaid dompurify @nuxt/a11y')
  })
})
