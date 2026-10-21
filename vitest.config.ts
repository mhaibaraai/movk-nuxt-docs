import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// 仅安装在 layer 下的依赖：统一解析到 layer，使测试中的 vi.mock 与被测代码命中同一模块
const layerDep = (name: string) => ({
  find: new RegExp(`^${name.replace('/', '\\/')}$`),
  replacement: fileURLToPath(new URL(`./layer/node_modules/${name}`, import.meta.url))
})

export default defineConfig({
  resolve: {
    alias: [layerDep('ai'), layerDep('@ai-sdk/openai')]
  },
  test: {
    include: ['test/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'layer/utils/**',
        'layer/shared/**',
        'layer/app/utils/**',
        'layer/server/utils/markdown.ts',
        'layer/server/utils/normalizeComponentName.ts',
        'layer/modules/ai-chat/runtime/server/utils/**'
      ]
    }
  }
})
