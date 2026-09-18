import { textContent } from 'minimark'

/**
 * minimark/stringify 的 markdown/html 格式无法表达的两类结构：
 * 没有管道表 handler（table 会输出为 HTML），pre 总是用三个反引号开围栏（代码自身含围栏时会被提前闭合）。
 * 两个函数都返回字符串，作为段落文本塞回语法树，由 stringifier 原样输出；
 * 链接保持原样，nuxt-agent-discovery 会在序列化后统一转为绝对地址。
 */

/** 返回一段不会被文本提前闭合的反引号：比文本中任何不少于 `minimum` 个的连续反引号更长，且至少为 `minimum` 个 */
function backticks(text: string, minimum: number): string {
  const runs = Array.from(text.matchAll(new RegExp(`\`{${minimum},}`, 'g')), match => match[0].length)
  return '`'.repeat(Math.max(minimum - 1, ...runs) + 1)
}

// GFM 在单元格内（包括行内代码）都把 `\|` 读作竖线，而行内代码里的其他反斜杠保持字面量。
// 因此普通文本同时转义反斜杠与竖线，行内代码只转义竖线，避免字面反斜杠被重复转义
function escapeText(text: string): string {
  return text.replace(/[\\|]/g, '\\$&')
}

function escapePipes(text: string): string {
  return text.split('|').join('\\|')
}

/** 把单元格可容纳的行内节点渲染为 Markdown */
function inlineMarkdown(node: any): string {
  if (typeof node === 'string') return escapeText(node)
  const [tag, attrs = {}, ...children] = node
  const inner = () => children.map(inlineMarkdown).join('')

  switch (tag) {
    case 'code': {
      const text = escapePipes(textContent(node))
      const fence = backticks(text, 1)
      // 首尾是反引号时加空格，避免与围栏粘连
      return /^`|`$/.test(text) ? `${fence} ${text} ${fence}` : `${fence}${text}${fence}`
    }
    case 'a': return `[${inner()}](${escapePipes(String(attrs.href ?? ''))})`
    case 'strong':
    case 'b': return `**${inner()}**`
    case 'em':
    case 'i': return `*${inner()}*`
    case 'del': return `~~${inner()}~~`
    case 'img': return `![${escapeText(String(attrs.alt ?? ''))}](${escapePipes(String(attrs.src ?? ''))})`
    // 管道表单元格唯一能容纳的换行
    case 'br': return '<br>'
    default: return inner()
  }
}

function cell(node: any): string {
  return inlineMarkdown(node).replace(/\s+/g, ' ').trim()
}

/** 将 table 节点渲染为 GFM 管道表，首行作为表头 */
export function pipeTable(table: any[]): string {
  const rows: string[][] = []
  for (const section of table.slice(2)) {
    if (!Array.isArray(section)) continue
    // 行位于 thead / tbody 下，也兼容直接出现的 tr
    for (const row of section[0] === 'tr' ? [section] : section.slice(2)) {
      if (Array.isArray(row) && row[0] === 'tr') {
        rows.push(row.slice(2).filter(child => Array.isArray(child)).map(cell))
      }
    }
  }

  const [header, ...body] = rows
  if (!header?.length) return ''

  const width = header.length
  const line = (cells: string[]) => `| ${Array.from({ length: width }, (_, i) => cells[i] ?? '').join(' | ')} |`

  return [line(header), line(header.map(() => '---')), ...body.map(line)].join('\n')
}

/** 围栏长度大于代码内任何类围栏反引号序列的代码块 */
export function fencedBlock(code: string, language = '', filename?: string, meta?: string): string {
  const fence = backticks(code, 3)
  return `${fence}${language}${filename ? ` [${filename}]` : ''}${meta || ''}\n${code.trim()}\n${fence}`
}
