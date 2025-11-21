import { addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { joinURL } from 'ufo'

export default defineNuxtModule({
  meta: {
    name: 'css'
  },
  async setup(_options, nuxt) {
    const dir = nuxt.options.rootDir
    const { resolve } = createResolver(import.meta.url)

    const layerDir = resolve('../app')
    const contentDir = joinURL(dir, 'content')

    const cssTemplate = addTemplate({
      filename: 'movk-nuxt-docs.css',
      getContents: () => {
        return `@import "tailwindcss";
@import "tailwindcss/theme.css" layer(theme) theme(static);
@import "@nuxt/ui";

@source "${contentDir.replace(/\\/g, '/')}/**/*";
@source "${layerDir.replace(/\\/g, '/')}/**/*";
@source "../../app.config.ts";`
      }
    })

    nuxt.options.css.unshift(cssTemplate.dst)
  }
})
