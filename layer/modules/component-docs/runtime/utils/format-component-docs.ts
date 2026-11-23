import type { Options } from 'prettier'
import babel from 'prettier/plugins/babel'
import estree from 'prettier/plugins/estree'
import html from 'prettier/plugins/html'
import markdown from 'prettier/plugins/markdown'
import typescript from 'prettier/plugins/typescript'
import { format } from 'prettier/standalone'

const plugins = [markdown, html, typescript, babel, estree]

export function formatComponentDocs(source: string, options: Options = {}) {
  // The standalone entry works in Workers, but does not load parsers automatically.
  return format(source, {
    parser: 'markdown',
    ...options,
    plugins: [...plugins, ...(options.plugins ?? [])]
  })
}
