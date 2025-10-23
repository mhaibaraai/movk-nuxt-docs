import { addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { joinURL } from 'ufo'
import { resolveModulePath } from 'exsolve'

export default defineNuxtModule({
  meta: {
    name: 'css'
  },
  async setup(_options, nuxt) {
    const dir = nuxt.options.rootDir
    const { resolve } = createResolver(import.meta.url)

    const layerDir = resolve('../app')
    const contentDir = joinURL(dir, 'content')
    const uiPath = resolveModulePath('@nuxt/ui', { from: import.meta.url, conditions: ['style'] })
    const tailwindPath = resolveModulePath('tailwindcss', { from: import.meta.url, conditions: ['style'] })
    const tailwindThemePath = tailwindPath.replace(/index\.css$/, 'theme.css')

    const cssTemplate = addTemplate({
      filename: 'movk-nuxt-docs.css',
      getContents: () => {
        return `@import ${JSON.stringify(tailwindPath)};
@import ${JSON.stringify(tailwindThemePath)} layer(theme) theme(static);
@import ${JSON.stringify(uiPath)};

@source "${contentDir.replace(/\\/g, '/')}/**/*";
@source "${layerDir.replace(/\\/g, '/')}/**/*";
@source "../../app.config.ts";`
      }
    })

    nuxt.options.css.unshift(cssTemplate.dst)
  }
})
