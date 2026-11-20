import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import uiConfig from './docs/eslint.ui.mjs'

export default createConfigForNuxt({
  dirs: {
    src: [
      './layer',
      './docs'
    ]
  },
  features: {
    tooling: true,
    stylistic: {
      commaDangle: 'never',
      braceStyle: '1tbs'
    }
  }
}).overrideRules({
  '@typescript-eslint/unified-signatures': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/ban-ts-comment': 'off'
}).append({
  files: ['**/*.vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 3, multiline: 1 }]
  }
}).append(uiConfig, {
  files: ['layer/app/app.vue'],
  rules: {
    'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['^root$'] }]
  }
}, {
  files: ['layer/app/components/content/StarsBg.vue'],
  rules: {
    'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['^stars?$', '^star-layer$'] }]
  }
}, {
  ignores: ['templates/**']
})
