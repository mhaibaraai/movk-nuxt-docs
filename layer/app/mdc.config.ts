import { defineConfig } from '@nuxtjs/mdc/config'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

export default defineConfig({
  shiki: {
    transformers: [
      transformerColorHighlight(),
      transformerIconHighlight() as any
    ]
  }
})
