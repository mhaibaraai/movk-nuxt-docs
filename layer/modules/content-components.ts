import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { defineNuxtModule } from '@nuxt/kit'
import { join } from 'pathe'
import { contentUiComponents, mergeComponentDetection } from '../utils/content-components'

function readMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter(file => file.endsWith('.md'))
    .map(file => readFileSync(join(dir, file), 'utf8'))
}

// Nuxt UI 的 componentDetection 只扫描 .vue/.ts，只在 Markdown 中使用的组件（如 u-page-hero）
// 不会生成主题类，导致布局与间距缺失；这里扫描内容目录补进检测列表。
// @nuxt/ui 在生成模板时才读取该选项，因此与模块执行顺序无关
export default defineNuxtModule({
  meta: {
    name: 'movk-nuxt-docs-content-components'
  },
  setup(_options, nuxt) {
    const experimental = nuxt.options.ui ? nuxt.options.ui.experimental : undefined
    if (!experimental?.componentDetection) return

    const sources = readMarkdownFiles(join(nuxt.options.rootDir, 'content'))
    const components = [...new Set(sources.flatMap(contentUiComponents))]
    experimental.componentDetection = mergeComponentDetection(experimental.componentDetection, components)
  }
})
