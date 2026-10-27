export type MinimarkNode = string | MinimarkElement
type MinimarkElement = [string, Record<string, unknown>, ...MinimarkNode[]]

const PACKAGE_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun', 'deno']
const LANGUAGES: Record<string, number> = { ts: 0, typescript: 0, js: 1, javascript: 1 }

interface SyncRule {
  key: string
  /** 返回标签页的排序值，任一标签页无法识别时整组不处理 */
  rank: (tab: MinimarkElement) => number | undefined
}

const RULES: SyncRule[] = [
  {
    key: 'package-manager',
    rank: (tab) => {
      const index = PACKAGE_MANAGERS.indexOf(String(tab[1].filename ?? tab[1].label ?? '').toLowerCase())
      return index === -1 ? undefined : index
    }
  },
  {
    key: 'language',
    rank: tab => LANGUAGES[String(tab[1].language ?? '').toLowerCase()]
  }
]

function syncGroup(node: MinimarkElement): MinimarkElement {
  const [tag, props] = node
  if (props.sync) return node

  const tabs = (node.slice(2) as MinimarkNode[]).filter((child): child is MinimarkElement => typeof child !== 'string')
  if (tabs.length < 2 || tabs.some(tab => tab[0] !== 'pre')) return node

  for (const rule of RULES) {
    const ranks = tabs.map(rule.rank)
    if (ranks.includes(undefined) || new Set(ranks).size !== ranks.length) continue

    const ordered = tabs
      .map((tab, index) => ({ tab, rank: ranks[index]! }))
      .sort((a, b) => a.rank - b.rank)
      .map(({ tab }) => tab)
    return [tag, { ...props, sync: rule.key }, ...ordered]
  }

  return node
}

/**
 * 为包管理器、TS / JS 代码组补上 Nuxt UI `ProseCodeGroup` 的 `sync`，使同类代码组全站联动。
 * `sync` 按标签页序号同步，因此同时把标签页排成统一顺序；已声明 `sync` 的代码组保持不变。
 */
export function syncCodeGroups(nodes: readonly MinimarkNode[]): MinimarkNode[] {
  return nodes.map((node) => {
    if (typeof node === 'string') return node

    const [tag, props] = node
    const next: MinimarkElement = [tag, props, ...syncCodeGroups(node.slice(2) as MinimarkNode[])]
    return tag === 'code-group' ? syncGroup(next) : next
  })
}
