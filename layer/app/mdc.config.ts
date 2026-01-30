import { defineConfig } from '@nuxtjs/mdc/config'
import { transformerIconHighlight } from './utils/shiki-transformer-icon-highlight'

export default defineConfig({
  shiki: {
    transformers: [
      transformerIconHighlight()
    ]
  }
})
