import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export default defineNitroPlugin((nitroApp) => {
  /**
   * @see
   * https://github.com/nuxt-content/nuxt-llms?tab=readme-ov-file#readme
   */
  nitroApp.hooks.hook('llms:generate', async (content, context) => {
    const { sections, domain } = context

    // Transform links except for "Documentation Sets"
    sections.forEach((section) => {
      if (section.title !== 'Documentation Sets') {
        section.links = section.links?.map(link => ({
          ...link,
          href: `${link.href.replace(new RegExp(`^${domain}`), `${domain}/raw`)}.md`
        }))
      }
    })

    // Move "Documentation Sets" to the end
    const docSetIdx = sections.findIndex(s => s.title === 'Documentation Sets')
    if (docSetIdx !== -1) {
      const [docSet] = sections.splice(docSetIdx, 1)
      sections.push(docSet)
    }

    // 在预渲染时生成静态文件
    if (import.meta.prerender && content && typeof content === 'string') {
      try {
        const publicDir = join(process.cwd(), 'public')
        await mkdir(publicDir, { recursive: true })

        await writeFile(join(publicDir, 'llms.txt'), content, 'utf-8')
        await writeFile(join(publicDir, 'llms-full.txt'), content, 'utf-8')

        console.log('✅ Static llms files generated in public/')
      } catch (error) {
        console.error('❌ Failed to write llms files:', error)
      }
    }
  })
})
