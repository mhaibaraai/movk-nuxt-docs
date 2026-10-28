import { pascalCase } from 'scule'

// 行首或空白后的 MDC 组件语法：`::u-page-hero`、`:u-button`、`::UPageCard`
const UI_COMPONENT_RE = /(?:^|\s):+(?:u-([a-z0-9]+(?:-[a-z0-9]+)*)|U([A-Z][A-Za-z0-9]*))(?![\w-])/gm

/** 提取 Markdown 中以 MDC 语法使用的 Nuxt UI 组件名（去掉 U 前缀的 PascalCase） */
export function contentUiComponents(source: string): string[] {
  const names = [...source.matchAll(UI_COMPONENT_RE)].map(([, kebab, pascal]) => kebab ? pascalCase(kebab) : pascal!)
  return [...new Set(names)]
}

/** 把内容中使用的组件并入 componentDetection；未开启检测时保持原值 */
export function mergeComponentDetection<T>(detection: T, components: string[]): T | string[] {
  if (!components.length || !detection) return detection
  if (detection === true) return components
  if (!Array.isArray(detection)) return detection
  const merged = [...new Set([...detection, ...components])]
  return merged.length === detection.length ? detection : merged
}
