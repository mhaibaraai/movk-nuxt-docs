import { addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { resolveModulePath } from 'exsolve'
import { joinURL } from 'ufo'

export default defineNuxtModule({
  meta: {
    name: 'css'
  },
  async setup(_options, nuxt) {
    const dir = nuxt.options.rootDir
    const resolver = createResolver(import.meta.url)

    const contentDir = joinURL(dir, 'content')
    const uiPath = resolveModulePath('@nuxt/ui', { from: import.meta.url, conditions: ['style'] })
    const tailwindPath = resolveModulePath('tailwindcss', { from: import.meta.url, conditions: ['style'] })
    const layerDir = resolver.resolve('../app')

    const cssTemplate = addTemplate({
      filename: 'docs.css',
      getContents: () => {
        return `@import ${JSON.stringify(tailwindPath)};
@import ${JSON.stringify(tailwindPath)}/theme.css theme(static);
@import ${JSON.stringify(uiPath)};

@source "${contentDir.replace(/\\/g, '/')}/**/*";
@source "${layerDir.replace(/\\/g, '/')}/**/*";
@source "../../app.config.ts";`
      }
    })

    nuxt.options.css.unshift(cssTemplate.dst)
  }
})
