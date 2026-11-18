import { createResolver, defineNuxtModule } from 'nuxt/kit'
import pkg from '../package.json'

const localD1Id = '00000000-0000-0000-0000-000000000000'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule({
  meta: { name: 'docs-cloudflare' },
  setup(_, nuxt) {
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || localD1Id
    nuxt.options.nitro.cloudflare = {
      deployConfig: true,
      wrangler: {
        d1_databases: [{
          binding: 'DB',
          database_name: `${pkg.name}-content`,
          database_id: databaseId
        }]
      }
    }

    nuxt.hook('nitro:config', (config) => {
      // Negotiate Markdown before falling back to the prerendered HTML asset.
      (config.handlers ||= []).push({
        middleware: true,
        handler: resolve('../runtime/cloudflare/prerendered.ts')
      })
    })

    nuxt.hook('nitro:build:before', () => {
      if (process.env.WORKERS_CI === '1' && databaseId === localD1Id) {
        throw new Error('Set CLOUDFLARE_D1_DATABASE_ID in Workers Builds before deploying.')
      }
    })
  }
})
