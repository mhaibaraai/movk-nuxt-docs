import { fileURLToPath } from 'node:url'
import nuxtUI from '@nuxt/ui/eslint'

const resolvePath = path => fileURLToPath(new URL(path, import.meta.url))
const [config] = nuxtUI({
  entryPoint: resolvePath('./.nuxt/movk-nuxt-docs.css'),
  files: ['{layer,docs}/app/**/*.vue', 'layer/modules/**/*.vue', '{layer,docs}/app/app.config.ts'],
  colors: { primary: 'vermilion', neutral: 'paper' },
  rules: {
    'no-conflicting-classes': 'error',
    'no-unknown-classes': 'error'
  }
})

export default {
  ...config,
  settings: {
    ...config.settings,
    'better-tailwindcss': {
      ...config.settings['better-tailwindcss'],
      cwd: resolvePath('.'),
      // Nuxt UI 的样式通过 #build/ui.css 引入生成的颜色和工具类。
      tsconfig: resolvePath('./.nuxt/tsconfig.app.json')
    }
  },
  rules: {
    ...config.rules,
    'better-tailwindcss/no-concatenated-classes': 'error'
  }
}
