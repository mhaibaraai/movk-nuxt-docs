// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.vue'],
    rules: {
      'vue/max-attributes-per-line': ['error', { singleline: 3, multiline: 1 }]
    }
  }
)
