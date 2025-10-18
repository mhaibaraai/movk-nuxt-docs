import { defineNuxtModule } from '@nuxt/kit'
import type { NuxtComponentMeta } from 'nuxt-component-meta'

export default defineNuxtModule({
  meta: {
    name: 'component-meta'
  },
  async setup(_options, nuxt) {
    // @ts-expect-error - Hook is not typed correctly
    nuxt.hook('component-meta:schema', (schema: NuxtComponentMeta) => {
      for (const componentName in schema) {
        const component = schema[componentName]
        // Delete schema from slots to reduce metadata file size
        if (component?.meta?.slots) {
          for (const slot of component.meta.slots) {
            delete (slot as any).schema
          }
        }
      }
    })
  }
})
