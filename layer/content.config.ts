import { defineCollection, defineContentConfig, property, z } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'
import { asSeoCollection } from '@nuxtjs/seo/content'
import { joinURL } from 'ufo'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')

export default defineContentConfig({
  collections: {
    landing: defineCollection(asSeoCollection({
      type: 'page',
      source: {
        cwd,
        include: 'index.md'
      }
    })),
    docs: defineCollection(asSeoCollection({
      type: 'page',
      source: [{
        cwd,
        include: 'docs/**/*'
      }],
      schema: z.object({
        links: property(z.object({})).inherit('@nuxt/ui/components/Button.vue'),
        category: z.string().optional(),
        navigation: z.object({
          title: z.string().optional()
        })
      })
    }))
  }
})
