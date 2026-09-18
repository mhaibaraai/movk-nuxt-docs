import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import { fileURLToPath } from 'node:url'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

/**
 * Tailwind 类名正确性检查。
 * entryPoint 用 layer/modules/css.ts 生成的编译根，它聚合了 tailwindcss、@nuxt/ui 与 layer 样式，
 * 由 postinstall 阶段的 nuxt prepare 生成。
 */
function betterTailwindcssConfig(files, entryPoint, ignore = []) {
  const resolvePath = path => fileURLToPath(new URL(path, import.meta.url))
  return {
    files,
    plugins: {
      'better-tailwindcss': betterTailwindcss
    },
    settings: {
      'better-tailwindcss': {
        // 转为绝对路径，编辑器 ESLint 服务在子目录运行时也能解析
        entryPoint: resolvePath(entryPoint),
        // tailwindcss 仅声明在 layer 中，根目录无法解析
        cwd: resolvePath('layer'),
        attributes: [
          '^(v-bind:|:)?class$',
          ['^(v-bind:|:)?ui$', [{ match: 'objectValues' }]]
        ]
      }
    },
    rules: {
      ...betterTailwindcss.configs['correctness-error'].rules,
      'better-tailwindcss/no-unknown-classes': ['error', { ignore }]
    }
  }
}

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
}).append(betterTailwindcssConfig(
  ['layer/app/**/*.vue', 'layer/modules/**/*.vue', 'docs/app/**/*.vue'],
  'docs/.nuxt/movk-nuxt-docs.css',
  // 在 scoped <style> 中定义的钩子类名，非 Tailwind 工具类
  ['^stars?$', '^star-layer$']
), {
  ignores: ['templates/**']
})
