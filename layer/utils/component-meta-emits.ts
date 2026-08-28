import { readFileSync } from 'node:fs'
import { hash } from 'ohash'
import type * as TS from 'typescript'

export interface EmitTag {
  name: string
  text?: string
}

export interface EmitDoc {
  description: string
  tags: EmitTag[]
}

interface EmitDocsCacheEntry {
  hash: string
  docs: Map<string, EmitDoc>
}

const SCRIPT_BLOCK_RE = /<script([^>]*)>([\s\S]*?)<\/script>/g
const JSDOC_LINE_PREFIX_RE = /^\s*\*+ ?/

const cache = new Map<string, EmitDocsCacheEntry>()

let typescript: typeof TS | null | undefined

/**
 * typescript 仅在构建期用于解析 JSDoc，缺失时静默降级
 */
async function loadTypeScript(): Promise<typeof TS | null> {
  if (typescript !== undefined) return typescript

  try {
    const mod = await import('typescript')
    typescript = ((mod as unknown as { default?: typeof TS }).default ?? mod) as typeof TS
  } catch {
    typescript = null
  }

  return typescript
}

function unquote(value: string): string {
  return value.replace(/^['"`]|['"`]$/g, '')
}

/**
 * 从源码原文切出标签内容
 * - 不能用 `tag.name` + `tag.comment` 拼接：`@see https://x` 会被 TS 拆成 `https` 与 `://x`
 */
function readTagText(ts: typeof TS, tag: TS.JSDocTag, source: string): string {
  return source
    .slice(tag.tagName.end, tag.end)
    .split('\n')
    .map(line => line.replace(JSDOC_LINE_PREFIX_RE, ''))
    .join('\n')
    .trim()
}

function readJsDoc(ts: typeof TS, node: TS.Node, source: string): EmitDoc {
  const blocks = (node as { jsDoc?: TS.JSDoc[] }).jsDoc ?? []
  const descriptions: string[] = []
  const tags: EmitTag[] = []

  for (const block of blocks) {
    const comment = ts.getTextOfJSDocComment(block.comment)
    if (comment) descriptions.push(comment)

    for (const tag of block.tags ?? []) {
      tags.push({ name: tag.tagName.text, text: readTagText(ts, tag, source) || undefined })
    }
  }

  return { description: descriptions.join('\n'), tags }
}

function resolveEventName(ts: typeof TS, member: TS.TypeElement): string | undefined {
  if (ts.isPropertySignature(member) && member.name) {
    return unquote(member.name.getText())
  }

  if (ts.isCallSignatureDeclaration(member)) {
    const type = member.parameters[0]?.type
    if (type && ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal)) {
      return type.literal.text
    }
  }
}

/**
 * 解析 `defineEmits<T>()` 的类型实参为成员列表，支持同文件内的 interface / type 引用
 */
function resolveEmitMembers(
  ts: typeof TS,
  typeNode: TS.TypeNode,
  sourceFile: TS.SourceFile
): readonly TS.TypeElement[] {
  if (ts.isTypeLiteralNode(typeNode)) return typeNode.members

  if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
    const name = typeNode.typeName.text

    for (const statement of sourceFile.statements) {
      if (ts.isInterfaceDeclaration(statement) && statement.name.text === name) {
        return statement.members
      }
      if (ts.isTypeAliasDeclaration(statement) && statement.name.text === name && ts.isTypeLiteralNode(statement.type)) {
        return statement.type.members
      }
    }
  }

  return []
}

/**
 * 提取 SFC 中 `defineEmits` 每个事件的 JSDoc 描述与标签
 */
export function extractEmitDocs(ts: typeof TS, source: string): Map<string, EmitDoc> {
  const docs = new Map<string, EmitDoc>()
  const script = [...source.matchAll(SCRIPT_BLOCK_RE)].find(match => /\bsetup\b/.test(match[1] ?? ''))?.[2]
  if (!script) return docs

  const sourceFile = ts.createSourceFile('emits.ts', script, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

  const visit = (node: TS.Node): void => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'defineEmits') {
      const typeNode = node.typeArguments?.[0]

      if (typeNode) {
        for (const member of resolveEmitMembers(ts, typeNode, sourceFile)) {
          const name = resolveEventName(ts, member)
          if (!name || docs.has(name)) continue

          const doc = readJsDoc(ts, member, script)
          if (doc.description || doc.tags.length) docs.set(name, doc)
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  ts.forEachChild(sourceFile, visit)

  return docs
}

function getEmitDocs(ts: typeof TS, filePath: string): Map<string, EmitDoc> {
  let source: string
  try {
    source = readFileSync(filePath, 'utf-8')
  } catch {
    return new Map()
  }

  const sourceHash = hash(source)
  const cached = cache.get(filePath)
  if (cached?.hash === sourceHash) return cached.docs

  const docs = extractEmitDocs(ts, source)
  cache.set(filePath, { hash: sourceHash, docs })

  return docs
}

interface ComponentMetaEvent {
  name: string
  description?: string
  tags?: EmitTag[]
  [key: string]: unknown
}

interface ComponentMetaEntry {
  fullPath?: string
  meta?: { events?: ComponentMetaEvent[], [key: string]: unknown }
  [key: string]: unknown
}

/**
 * 回填 `defineEmits` 的描述与标签
 *
 * `vue-component-meta` 从 `$emit` 的调用签名读取 JSDoc，而 `$emit` 的类型经 `EmitFn` /
 * `__VLS_ShortEmits` 两层映射类型重新合成，原属性上的注释在类型层已丢失（vuejs/language-tools#3893、#5341）。
 * 这里按源码回填，且只填补空值，上游修复后自动让位。
 */
export async function applyEmitDocs<T extends Record<string, ComponentMetaEntry>>(schema: T): Promise<T> {
  const ts = await loadTypeScript()
  if (!ts) return schema

  for (const component of Object.values(schema)) {
    const events = component?.meta?.events
    const fullPath = component?.fullPath

    if (!fullPath?.endsWith('.vue') || !Array.isArray(events) || events.length === 0) continue

    const docs = getEmitDocs(ts, fullPath)
    if (docs.size === 0) continue

    // 就地写入：nuxt-component-meta 的 schema 钩子按引用消费，与同文件的 component-meta:extend 一致
    for (const event of events) {
      const doc = docs.get(event.name)
      if (!doc) continue

      if (!event.description) event.description = doc.description
      if (!event.tags?.length && doc.tags.length) event.tags = doc.tags
    }
  }

  return schema
}
