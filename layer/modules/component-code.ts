import { defineNuxtModule, addTemplate, addTypeTemplate, updateTemplates } from '@nuxt/kit'
import { join } from 'pathe'

interface ComponentEntry {
  pascalName: string
  filePath: string
}

export default defineNuxtModule({
  meta: { name: 'component-code' },
  setup(_options, nuxt) {
    let components: ComponentEntry[] = []
    const VIRTUAL_FILENAME = 'component-code/registry.mjs'

    nuxt.hook('components:extend', (_components) => {
      components = _components
        .filter(c =>
          c.pascalName
          && c.filePath
          && !c.pascalName.startsWith('Nuxt')
          && !c.pascalName.startsWith('ServerPlaceholder'))
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

    addTypeTemplate({
      filename: 'types/component-code-registry.d.ts',
      getContents: () => `declare module '#component-code/registry' {
  import type { Component } from 'vue'
  export const registry: Record<string, Component>
}
`
    })

    nuxt.hook('builder:watch', async (event, path) => {
      if (!path.endsWith('.vue')) return
      await updateTemplates({ filter: t => t.filename === VIRTUAL_FILENAME })
    })
  }
})
