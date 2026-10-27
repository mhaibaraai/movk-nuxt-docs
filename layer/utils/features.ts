import type { Nuxt } from '@nuxt/schema'
import { hasAnyAiKey } from '../modules/ai-chat/keys'

export interface FeatureOptions {
  /**
   * 组件文档：nuxt-component-meta、ComponentProps / Slots / Emits / Code / Example 及 Prettier 格式化
   * @defaultValue false
   */
  componentDocs?: boolean
  /**
   * 内置 MCP Server（@nuxtjs/mcp-toolkit），AI Chat 依赖此项
   * @defaultValue true
   */
  mcp?: boolean
  /**
   * 构建期生成 OG 图片（nuxt-og-image + takumi）
   * @defaultValue true
   */
  ogImage?: boolean
  /**
   * Mermaid 图表，需安装 mermaid 与 dompurify
   * @defaultValue false
   */
  mermaid?: boolean
  /**
   * @nuxt/a11y 开发期无障碍检查
   * @defaultValue false
   */
  a11y?: boolean
}

export type ResolvedFeatures = Required<FeatureOptions> & { aiChat: boolean }

/**
 * 合并功能开关默认值。aiChat.enabled 未设置时，以构建期是否存在 AI_API_KEY 决定（兼容 v2 行为）
 */
export function resolveFeatures(
  options: FeatureOptions,
  aiChat: { enabled?: boolean },
  { hasAiKey = false }: { hasAiKey?: boolean } = {}
): ResolvedFeatures {
  const features: ResolvedFeatures = {
    componentDocs: options.componentDocs ?? false,
    mcp: options.mcp ?? true,
    ogImage: options.ogImage ?? true,
    mermaid: options.mermaid ?? false,
    a11y: options.a11y ?? false,
    aiChat: aiChat.enabled ?? hasAiKey
  }

  if (features.aiChat && !features.mcp) {
    throw new Error('[@movk/nuxt-docs] aiChat 依赖 MCP Server，请勿在启用 aiChat 时设置 movkNuxtDocs.mcp: false')
  }

  return features
}

/** 从 nuxt.options 读取并解析功能开关，模块与内联配置共用 */
export function getFeatures(nuxt: Nuxt): ResolvedFeatures {
  const options = nuxt.options as unknown as { movkNuxtDocs?: FeatureOptions, aiChat?: { enabled?: boolean } }
  return resolveFeatures(options.movkNuxtDocs || {}, options.aiChat || {}, { hasAiKey: hasAnyAiKey() })
}
