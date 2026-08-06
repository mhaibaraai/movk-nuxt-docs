import { addTemplate, defineNuxtModule, useLogger } from '@nuxt/kit'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'pathe'
import { resolveModulePath } from 'exsolve'

const TAILWIND_ROOT_RE = /@import\s+["']tailwindcss["']/

function resolveCssEntry(entry: string, srcDir: string, rootDir: string): string {
  if (entry.startsWith('~~/') || entry.startsWith('@@/')) {
    return join(rootDir, entry.slice(3))
  }
  if (entry.startsWith('~/') || entry.startsWith('@/')) {
    return join(srcDir, entry.slice(2))
  }
  return entry
}

export default defineNuxtModule({
  meta: {
    name: 'movk-nuxt-docs-css'
  },
  setup(_options, nuxt) {
    const logger = useLogger('movk-nuxt-docs')
    const currentDir = dirname(fileURLToPath(import.meta.url))
    const layerDir = join(currentDir, '..')
    const layerCssPath = join(layerDir, 'app/assets/css/main.css')

    const { rootDir, srcDir } = nuxt.options
    const contentDir = join(rootDir, 'content')
    const userCssPath = join(srcDir, 'assets/css/main.css')

    const uiPath = resolveModulePath('@nuxt/ui', { from: import.meta.url, conditions: ['style'] })
    const tailwindPath = resolveModulePath('tailwindcss', { from: import.meta.url, conditions: ['style'] })

    nuxt.options.css ||= []

    // 消费方样式并入同一个 Tailwind root。独立的 @import "tailwindcss" 会编译出第二份工具类，
    // 且按 nuxt.options.css 顺序排在 layer 之后；同处 @layer utilities、特异性相同，
    // 于是后出现的 .flex 会盖掉 layer 的 .lg\:grid（媒体查询不提升特异性），布局随之塌陷。
    nuxt.options.css = nuxt.options.css.filter(entry => typeof entry !== 'string'
      || resolveCssEntry(entry, srcDir, rootDir) !== userCssPath)

    for (const entry of nuxt.options.css) {
      if (typeof entry !== 'string') {
        continue
      }
      const file = resolveCssEntry(entry, srcDir, rootDir)
      if (!existsSync(file) || !TAILWIND_ROOT_RE.test(readFileSync(file, 'utf8'))) {
        continue
      }
      logger.warn(`@import "tailwindcss" in ${entry} creates a second Tailwind root that overrides the layer's responsive utilities.`
        + ` Remove the import, or move the styles to ${userCssPath}, which is merged into the layer's root automatically.`)
    }

    const cssTemplate = addTemplate({
      filename: 'movk-nuxt-docs.css',
      write: true,
      getContents: () => {
        // theme(static) 保证 --container-8xl 一类仅被普通 CSS 引用的变量也会输出
        const imports = [
          `@import ${JSON.stringify(tailwindPath)} theme(static);`,
          `@import ${JSON.stringify(uiPath)};`,
          `@import ${JSON.stringify(layerCssPath)};`
        ]

        // layer 自身执行 nuxt prepare 时 srcDir 即 layer/app，跳过以免重复导入
        if (userCssPath !== layerCssPath && existsSync(userCssPath)) {
          imports.push(`@import ${JSON.stringify(userCssPath)};`)
        }

        // @nuxt/ui 的 #build/ui.css 已登记各 layer 的 app/ 目录，此处补齐模块内置组件与内容目录。
        // 用显式 glob 而非目录，确保 layer 以 npm 包安装（位于 node_modules 下）时不会被忽略
        return `${imports.join('\n')}

@source ${JSON.stringify(`${join(layerDir, 'modules')}/**/*`)};
@source ${JSON.stringify(`${contentDir}/**/*`)};
`
      }
    })

    nuxt.options.css.unshift(cssTemplate.dst)
  }
})
