import type { Resolver } from '@nuxt/kit'
import { join } from 'pathe'

/**
 * 匹配组件是否符合用户定义的 include 模式
 * @param filePath 组件文件路径
 * @param pascalName 组件 PascalCase 名称
 * @param includePatterns 包含模式数组(字符串 glob、正则表达式或函数)
 * @returns 是否匹配
 */
function matchesUserInclude(
  filePath: string,
  pascalName: string,
  includePatterns: Array<string | RegExp | ((component: { filePath: string, pascalName: string }) => boolean)>
): boolean {
  return includePatterns.some((pattern) => {
    if (typeof pattern === 'string') {
      // 简单的 glob 支持: ** 匹配任意路径，* 匹配非路径分隔符
      const regexPattern = pattern
        .replace(/\*\*/g, '{{DOUBLE_STAR}}')
        .replace(/\*/g, '[^/]*')
        .replace(/\{\{DOUBLE_STAR\}\}/g, '.*')
      const regex = new RegExp(regexPattern)
      return regex.test(filePath) || filePath.includes(pattern)
    }
    if (pattern instanceof RegExp) {
      return pattern.test(filePath) || pattern.test(pascalName)
    }
    if (typeof pattern === 'function') {
      return pattern({ filePath, pascalName })
    }
    return false
  })
}

/**
 * 检查组件是否为用户组件
 * @param filePath 组件文件路径
 * @param userComponentPaths 用户组件路径数组
 * @returns 是否为用户组件
 */
export function isUserComponent(filePath: string, userComponentPaths: string[]): boolean {
  return userComponentPaths.some(path => filePath.startsWith(path))
}

/**
 * 创建 component-meta exclude 过滤器
 * @param layerPath layer 路径
 * @param allowedComponents 允许的组件列表
 * @param userComponentPaths 用户组件路径数组
 * @param userInclude 用户定义的 include 模式
 * @returns exclude 过滤器数组
 */
export function createComponentMetaExcludeFilters(
  resolve: Resolver['resolve'],
  dir: string,
  layerPath: string,
  userInclude: Array<string | RegExp | ((component: { filePath: string, pascalName: string }) => boolean)>
) {
  const allowedComponents = [
    resolve('../app/components/content/CommitChangelog.vue'),
    resolve('../app/components/content/ComponentEmits.vue'),
    resolve('../app/components/content/ComponentExample.vue'),
    resolve('../app/components/content/ComponentProps.vue'),
    resolve('../app/components/content/ComponentSlots.vue'),
    resolve('../app/components/content/PageLastCommit.vue'),
    resolve('../app/components/content/Mermaid.vue'),
    resolve('./ai-chat/runtime/components/AiChatToolCall.vue'),
    resolve('./ai-chat/runtime/components/AiChatReasoning.vue'),
    resolve('./ai-chat/runtime/components/AiChatSlideoverFaq.vue'),
    resolve('./ai-chat/runtime/components/AiChatPreStream.vue')
  ]

  const userComponentPaths = [
    join(dir, 'app/components'),
    join(dir, 'components'),
    join(dir, 'docs/app/components'),
    join(dir, 'templates/*/app/components')
  ]

  return [
    // 排除 layer 中不在白名单的组件
    ({ filePath }: { filePath: string }) =>
      filePath.startsWith(layerPath) && !allowedComponents.includes(filePath),
    // 排除用户组件中不符合 include 规则的组件
    ({ filePath, pascalName }: { filePath: string, pascalName: string }) => {
      const isUser = isUserComponent(filePath, userComponentPaths)
      if (!isUser) return false

      // 如果没有指定 include，排除所有用户组件
      if (userInclude.length === 0) return true

      // 如果指定了 include，排除不匹配的组件
      return !matchesUserInclude(filePath, pascalName, userInclude)
    }
  ]
}
