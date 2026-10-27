import type { H3Event } from 'h3'
import { camelCase } from 'scule'
import type { Document } from '../mdc/nodes'
import { flattenMarkers, wrapBlockText } from '../mdc/nodes'
import { transformComponentDocs } from '../mdc/component-docs'
import { transformChangelog } from '../mdc/changelog'
import { transformProse } from '../mdc/prose'

/**
 * agent-discovery 输出 /raw/**.md 前，把文档中的 MDC 组件转为纯 Markdown。
 * 各组转换按顺序执行：通用组件的 pre 处理依赖前面生成的代码块
 */
export async function transformMDC(event: H3Event, doc: Document): Promise<Document> {
  const componentName = camelCase(doc.title)

  await transformComponentDocs(doc, componentName)
  await transformChangelog(event, doc)
  await transformProse(event, doc)

  // Flatten __flatten markers by splicing their children into parents
  const root = Array.isArray(doc.body) ? doc.body : doc.body?.value
  if (Array.isArray(root)) {
    flattenMarkers(root, 0)
    wrapBlockText(root)
  }

  return doc
}
