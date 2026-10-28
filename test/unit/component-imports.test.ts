import { describe, expect, it } from 'vitest'
import { runtimeBareImports } from '../../layer/utils/component-imports'

describe('runtimeBareImports', () => {
  it('提取运行时导入的包名说明符', () => {
    const source = `<script setup lang="ts">
import { computed } from 'vue'
import { Chart as TanStackChart } from '@tanstack/charts/vue'
import { areaY, barY } from "@tanstack/charts"
import 'side-effect'
</script>`
    expect(runtimeBareImports(source)).toEqual(['vue', '@tanstack/charts/vue', '@tanstack/charts', 'side-effect'])
  })

  it('忽略类型导入、相对路径与别名', () => {
    const source = `import type { ChartPoint } from '@tanstack/charts/vue'
import theme from '#build/ui/chart'
import Tooltip from './Tooltip.vue'
import { get } from '/abs/utils'
import foo from '~/foo'`
    expect(runtimeBareImports(source)).toEqual([])
  })

  it('去重', () => {
    expect(runtimeBareImports(`import a from 'pkg'\nimport { b } from 'pkg'`)).toEqual(['pkg'])
  })
})

describe('runtimeBareImports 边界', () => {
  it('支持多行导入，忽略 import.meta 与动态导入', () => {
    const source = `import {
  a,
  b
} from 'multi'
const env = import.meta.env.MODE === 'x'
const lazy = import('lazy')`
    expect(runtimeBareImports(source)).toEqual(['multi'])
  })
})
