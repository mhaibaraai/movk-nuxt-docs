import { defineCollection, defineContentConfig, z, property } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    releases: defineCollection(asSeoCollection({
      type: 'page',
      source: 'releases.yml',
      schema: z.object({
        releases: z.string(),
        hero: property(z.object({})).inherit('@nuxt/ui/components/PageHero.vue')
      })
    }))
  }
})
