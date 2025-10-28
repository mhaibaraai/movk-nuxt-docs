import { defineNuxtModule } from '@nuxt/kit'
import { copyFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineNuxtModule({
  meta: {
    name: 'llms'
  },
  async setup(_options, nuxt) {
    /**
     * @see https://vercel.com/docs/functions/configuring-functions/advanced-configuration
     * Vercel 会将所有动态路由转为 Serverless Function，导致 500 错误。
     * 访问 '_llms-full.txt' 静态资源以绕过此问题。
     */
    nuxt.hook('nitro:build:public-assets', async ({ options }) => {
      const outputDir = options.output.publicDir
      try {
        const source = join(outputDir, 'llms-full.txt')
        const dest = join(outputDir, '_llms-full.txt')
        await copyFile(source, dest)
        console.log(`✅ Copied: ${source} → ${dest}`)
      } catch (err) {
        console.warn(`⚠️  Failed to process:`, err instanceof Error ? err.message : String(err))
      }
    })
  }
})
