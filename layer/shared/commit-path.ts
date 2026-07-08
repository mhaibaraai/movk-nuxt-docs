import { camelCase, kebabCase, upperFirst } from 'scule'

export type CommitCasing = 'auto' | 'kebab' | 'camel' | 'pascal'

export interface CommitPathParts {
  basePath: string
  prefix?: string
  suffix: string
  name: string
  casing: CommitCasing
}

/**
 * 根据命名格式与扩展名，将文件名解析为仓库中的完整文件路径
 * 供客户端组件 CommitChangelog 与服务端 transformMDC 共用，保证两处推导一致
 */
export function resolveCommitFilePath({ basePath, prefix, suffix, name, casing }: CommitPathParts): string {
  const transformedName = (() => {
    switch (casing) {
      case 'kebab':
        return kebabCase(name)
      case 'camel':
        return camelCase(name)
      case 'pascal':
        return upperFirst(camelCase(name))
      case 'auto':
      default:
        return suffix === 'vue'
          ? upperFirst(camelCase(name))
          : camelCase(name)
    }
  })()

  const filePrefix = prefix ? `${prefix}/` : ''
  return `${basePath}/${filePrefix}${transformedName}.${suffix}`
}
