import { existsSync, readFileSync } from 'node:fs'
import { addTemplate, updateTemplates } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { resolveModulePath } from 'exsolve'
import { join } from 'pathe'
import { runtimeBareImports } from '../../utils/component-imports'

interface ComponentEntry {
  pascalName: string
  filePath: string
}

// 依赖包中的组件可能导入未安装的可选 peer（如 UChart 的 @tanstack/charts），打包时会解析失败
function hasResolvableImports(filePath: string): boolean {
  if (!filePath.includes('/node_modules/') || !existsSync(filePath)) return true
  return runtimeBareImports(readFileSync(filePath, 'utf8'))
    .every(specifier => resolveModulePath(specifier, { from: filePath, try: true }))
}

/** 为 ComponentCode 生成全部组件的异步注册表 */
export function setupCodeRegistry(nuxt: Nuxt): void {
  let components: ComponentEntry[] = []
  const VIRTUAL_FILENAME = 'component-code/registry.mjs'

  nuxt.hook('components:extend', (_components) => {
    components = _components
      .filter(c =>
        c.pascalName
        && c.filePath
        && !c.pascalName.startsWith('Nuxt')
        && !c.pascalName.startsWith('ServerPlaceholder')
        && hasResolvableImports(c.filePath))
      .map(c => ({ pascalName: c.pascalName, filePath: c.filePath }))
  })

  addTemplate({
    filename: VIRTUAL_FILENAME,
    write: true,
    getContents: () => {
      const imports: string[] = ['import { defineAsyncComponent } from \'vue\'']
      const entries: string[] = []
      const seen = new Set<string>()
      for (const c of components) {
        if (seen.has(c.pascalName)) continue
        seen.add(c.pascalName)
        entries.push(`  ${JSON.stringify(c.pascalName)}: defineAsyncComponent(() => import(${JSON.stringify(c.filePath)}))`)
      }
      return `${imports.join('\n')}\n\nexport const registry = {\n${entries.join(',\n')}\n}\n`
    }
  })

  nuxt.options.alias ||= {}
  nuxt.options.alias['#component-code/registry'] = join(nuxt.options.buildDir, VIRTUAL_FILENAME)

  nuxt.hook('builder:watch', async (event, path) => {
    if (!path.endsWith('.vue')) return
    await updateTemplates({ filter: t => t.filename === VIRTUAL_FILENAME })
  })
}
