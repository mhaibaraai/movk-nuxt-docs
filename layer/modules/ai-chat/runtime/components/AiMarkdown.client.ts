import { defineMarkdownComponent } from '@comark/vue'
import highlight from '@comark/vue/plugins/highlight'
import githubDark from '@shikijs/themes/github-dark'
import githubLight from '@shikijs/themes/github-light'

export default defineMarkdownComponent({
  name: 'AiMarkdown',
  plugins: [
    // 与正文代码块保持同一套高亮主题
    highlight({ registerDefaultThemes: false, themes: { light: githubLight, dark: githubDark } })
  ],
  class: '*:first:mt-0 *:last:mb-0'
})
