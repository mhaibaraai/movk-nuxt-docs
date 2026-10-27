import type { H3Event } from 'h3'
import { resolveCommitFilePath } from '../../shared/commit-path'
import { getAgentSiteUrl } from '#agent-discovery'
import type { Document } from './nodes'
import { collectBlockChildren, parseAttrAsObject, readMdcAttr, visitAndReplace } from './nodes'

/** commit-changelog 转为指向提交与版本的 Markdown 列表 */
export async function transformChangelog(event: H3Event, doc: Document): Promise<void> {
  // Transform commit-changelog to changelog content
  const changelogNodes: any[][] = []

  visitAndReplace(doc, 'commit-changelog', (node) => {
    changelogNodes.push(node)
  })

  if (changelogNodes.length) {
    const { github } = useAppConfig() as { github: Record<string, any> }
    // 站点规范地址而非构建期请求源：文档会被预渲染，绝对链接就此烘进产物
    const origin = getAgentSiteUrl(event)

    changelogNodes.forEach((node) => {
      const attrs = node[1] || {}
      const githubUrl = github?.url || ''
      const branch = github?.branch || 'main'

      const resolveOne = (override: Record<string, any>): string => resolveCommitFilePath({
        basePath: override.commitPath ?? override['commit-path'] ?? attrs.commitPath ?? attrs['commit-path'] ?? github?.commitPath ?? 'src',
        prefix: override.prefix ?? attrs.prefix,
        suffix: override.suffix ?? attrs.suffix ?? github?.suffix ?? 'vue',
        name: override.name ?? attrs.name ?? doc.title ?? '',
        casing: override.casing ?? attrs.casing ?? github?.casing ?? 'auto'
      })

      // 块 frontmatter 的数组值在 AST 里以 `:files` 绑定形式存为 JSON 字符串
      const files = parseAttrAsObject<Record<string, any>[]>(readMdcAttr(attrs, 'files'), [])
      const overrides = Array.isArray(files) && files.length ? files : [{}]
      const filePaths: string[] = overrides.map(resolveOne)

      node[0] = 'p'
      node[1] = {}
      let idx = 2
      node[idx++] = 'See commit history for '
      filePaths.forEach((filePath, i) => {
        if (i > 0) node[idx++] = '、'
        const commitsUrl = githubUrl
          ? `${githubUrl}/commits/${branch}/${filePath}`
          : `${origin}/${filePath}`
        node[idx++] = ['a', { href: commitsUrl }, filePath]
      })
      node[idx++] = '.'
      node.length = idx
    })
  }

  // Transform callout components (tip, note, warning, caution, callout) to blockquotes, including prose-* full names
  const calloutLabels: Record<string, string> = {
    tip: 'TIP',
    note: 'NOTE',
    warning: 'WARNING',
    caution: 'CAUTION',
    callout: 'NOTE'
  }

  for (const [type, label] of Object.entries(calloutLabels)) {
    visitAndReplace(doc, type, node => replaceCallout(node, label))
    visitAndReplace(doc, `prose-${type}`, node => replaceCallout(node, label))
  }
}

function replaceCallout(node: any[], label: string) {
  const attrs = node[1] || {}
  const content = node.slice(2)

  const blockquoteChildren: any[] = []

  let firstLine = `[!${label}]`
  if (attrs.to) {
    firstLine += `\nSee: ${attrs.to}`
  }
  blockquoteChildren.push(['p', {}, firstLine])

  blockquoteChildren.push(...collectBlockChildren(content))

  node[0] = 'blockquote'
  node[1] = {}
  node.length = 2
  for (const child of blockquoteChildren) {
    node.push(child)
  }
}
