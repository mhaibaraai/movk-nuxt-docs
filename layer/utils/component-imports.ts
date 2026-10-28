const IMPORT_RE = /^[ \t]*import\b([^'"]*)['"]([^'"]+)['"]/gm
const BARE_RE = /^(?:@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*(?:\/.*)?$/i

// 仅保留静态导入：`import 'x'` 或 `import ... from 'x'`，排除 `import type` 与 `import.meta`、`import()`
function isRuntimeImport(clause: string): boolean {
  const trimmed = clause.trim()
  if (!trimmed) return true
  return /^\s/.test(clause) && !trimmed.startsWith('type ') && trimmed.endsWith('from')
}

/** 提取组件源码中运行时导入的包名说明符，忽略类型导入、相对路径与别名 */
export function runtimeBareImports(source: string): string[] {
  const specifiers = [...source.matchAll(IMPORT_RE)]
    .filter(match => isRuntimeImport(match[1]!))
    .map(match => match[2]!)
  return [...new Set(specifiers.filter(specifier => BARE_RE.test(specifier)))]
}
