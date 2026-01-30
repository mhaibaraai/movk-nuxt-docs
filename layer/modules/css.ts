import { addTemplate, defineNuxtModule } from '@nuxt/kit'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { joinURL } from 'ufo'
import { resolveModulePath } from 'exsolve'

export default defineNuxtModule({
  meta: {
    name: 'css'
  },
  setup(_options, nuxt) {
    const currentDir = dirname(fileURLToPath(import.meta.url))
    const mainCssPath = join(currentDir, '../app/assets/css/main.css')

    nuxt.options.css ||= []
    nuxt.options.css.unshift(mainCssPath)

    const dir = nuxt.options.rootDir

    const contentDir = joinURL(dir, 'content')
    const uiPath = resolveModulePath('@nuxt/ui', { from: import.meta.url, conditions: ['style'] })
    const tailwindPath = resolveModulePath('tailwindcss', { from: import.meta.url, conditions: ['style'] })

    const cssTemplate = addTemplate({
      filename: 'movk-nuxt-docs.css',
      getContents: () => {
        return `@import ${JSON.stringify(tailwindPath)};
@import ${JSON.stringify(uiPath)};

@source "${contentDir.replace(/\\/g, '/')}/**/*";`
      }
    })

    nuxt.options.css.unshift(cssTemplate.dst)
  }
})
