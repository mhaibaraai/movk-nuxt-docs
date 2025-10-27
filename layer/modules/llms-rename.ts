import { rename } from 'node:fs/promises'
import { join } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'llms-rename',
    configKey: 'llmsRename'
  },
  setup(_options, nuxt) {
    if (nuxt.options.dev) return

    nuxt.hook('nitro:build:public-assets', async (nitro) => {
      const outputPublicDir = join(nitro.options.output.publicDir)

      const files = [
        { from: 'llms.txt', to: '_llms.txt' },
        { from: 'llms-full.txt', to: '_llms-full.txt' }
      ]

      for (const { from, to } of files) {
        try {
          const source = join(outputPublicDir, from)
          const dest = join(outputPublicDir, to)
          await rename(source, dest)
          console.log(`✅ Renamed: ${from} → ${to}`)
        } catch (error) {
          console.warn(`⚠️  Failed to rename ${from}:`, error instanceof Error ? error.message : 'Unknown error')
        }
      }
    })
  }
})
