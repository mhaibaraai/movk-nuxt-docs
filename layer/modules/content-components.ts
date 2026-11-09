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

// 只在 Markdown 中使用的组件（如 u-page-hero）须进入 componentDetection，否则不会生成主题类，
// 导致布局与间距缺失；这里扫描内容目录补进检测列表。
// @nuxt/ui 在生成模板时才读取该选项，因此与模块执行顺序无关
export default defineNuxtModule({
  meta: {
    name: 'movk-nuxt-docs-content-components'
  },
  setup(_options, nuxt) {
    const ui = nuxt.options.ui
    if (!ui) return
    // v5 缺省开启检测，未声明时按 true 处理
    const detection = ui.componentDetection ?? true
    if (!detection) return

    const sources = readMarkdownFiles(join(nuxt.options.rootDir, 'content'))
    const components = [...new Set(sources.flatMap(contentUiComponents))]
    ui.componentDetection = mergeComponentDetection(detection, components)
  }
})
