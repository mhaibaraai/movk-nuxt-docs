import type { ComputedRef, WritableComputedRef } from 'vue'

/** 页头选择器与文档外壳共享的主题状态，可由消费方在当前 Nuxt app 中提供 */
export interface DocsTheme {
  /** 未选择时沿用样式表的主色 */
  primary: WritableComputedRef<string | undefined>
  primaryColors: string[]
  /** 未选择时沿用样式表的中性色 */
  neutral: WritableComputedRef<string | undefined>
  neutralColors: string[]
  radius: WritableComputedRef<number>
  radiuses: number[]
  icon: WritableComputedRef<string>
  icons: { label: string, icon: string, value: string }[]
  mode: WritableComputedRef<string>
  modes: ComputedRef<{ label: string, icon: string | undefined }[]>
  blackAsPrimary: ComputedRef<boolean>
  setBlackAsPrimary: (value: boolean) => void
  color: ComputedRef<string | undefined>
  style: { innerHTML: ComputedRef<string>, id: string, tagPriority: number }[]
  hasCSSChanges: ComputedRef<boolean>
  hasConfigChanges: ComputedRef<boolean>
  configLabel: string
  exportCSS: () => string
  exportConfig: () => string
  resetTheme: () => void
}

declare module '#app' {
  interface NuxtApp {
    /** 消费方提供时，Layer 使用该主题并跳过内置主题插件 */
    $docsTheme?: DocsTheme
  }
}
