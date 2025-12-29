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
@source "../../app.config.ts";

/* Shiki icon highlight transformer styles */
.shiki-icon-highlight {
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  vertical-align: -0.25em;
  margin-right: 0.125em;
  background-color: var(--ui-text-highlighted);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-image: var(--shiki-icon-url);
  mask-image: var(--shiki-icon-url);
}`
      }
    })

    nuxt.options.css.unshift(cssTemplate.dst)
  }
})
