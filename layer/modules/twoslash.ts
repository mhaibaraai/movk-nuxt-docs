import { writeFileSync } from 'node:fs'
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: { name: 'movk-nuxt-docs-twoslash' },
  moduleDependencies: {
    'nuxt-content-twoslash': {
      version: '>=0.4.0',
      defaults: {
        enableInDev: false,
        throws: false,
        includeNuxtTypes: false
      }
    }
  },
  setup(_options, nuxt) {
    nuxt.hook('app:templatesGenerated', async (_app, templates) => {
      const tmpl = (templates as any[]).find(t => t.filename === 'twoslash-meta.mjs')
      if (!tmpl?.getContents) return

      await nuxt.callHook('movk:twoslash:meta', tmpl)

      writeFileSync(tmpl.dst, tmpl.getContents())
    })
  }
})

declare module 'nuxt/schema' {
  interface NuxtHooks {
    'movk:twoslash:meta': (template: { filename: string, dst: string, getContents: () => string }) => void | Promise<void>
  }
}
