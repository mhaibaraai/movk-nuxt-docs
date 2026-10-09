import type { ShikiTransformer } from '@shikijs/core'
import { defineConfig } from '@nuxtjs/mdc/config'
import { defaultGetForegroundColor, transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

// 内容管线会把色块的行内样式转成生成类，这里补一个固定类名供 main.css 暗色规则跳过
const transformerColorHighlightClass = (): ShikiTransformer => ({
  name: 'color-highlight-class',
  span(hast, _line, _col, _lineElement, token) {
    if (token.bgColor) {
      this.addClassToHast(hast, 'shiki-color-highlight')
    }
  }
})

export default defineConfig({
  shiki: {
    transformers: [
      // 纯单词（如 `primary: violet`）是 Tailwind 调色板名而非 CSS 颜色，只为字面颜色值显示色块
      transformerColorHighlight({ getForegroundColor: color => /^[a-z]+$/i.test(color) ? null : defaultGetForegroundColor(color) }),
      transformerIconHighlight() as any,
      transformerColorHighlightClass() as any
    ]
  }
})
