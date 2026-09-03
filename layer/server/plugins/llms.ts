import type { LLMsSection } from 'nuxt-llms'

export default defineNitroPlugin((nitroApp) => {
  // nuxt-llms 把「Documentation Sets」（指向 llms-full.txt 的单条链接）插在最前面，
  // 文档本身更值得先出现。链接改写成 /raw/**.md 由 nuxt-agent-discovery 负责。
  nitroApp.hooks.hook('llms:generate', (_, { sections }) => {
    const docSetIdx = sections.findIndex((s: LLMsSection) => s.title === 'Documentation Sets')
    if (docSetIdx !== -1) {
      const [docSet] = sections.splice(docSetIdx, 1)
      if (docSet) {
        sections.push(docSet)
      }
    }
  })
})
