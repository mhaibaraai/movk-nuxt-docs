import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { join } from 'pathe'
import { defu } from 'defu'
import { getGitBranch, getGitEnv, getLocalGitInfo } from '../utils/git'
import { getPackageJsonMetadata, inferSiteURL } from '../utils/meta'

export default defineNuxtModule({
  meta: {
    name: 'config'
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const dir = nuxt.options.rootDir
    const url = inferSiteURL()
    const meta = await getPackageJsonMetadata(dir)
    const gitInfo = await getLocalGitInfo(dir) || getGitEnv()
    const siteName = nuxt.options?.site?.name || meta.name || gitInfo?.name || ''

    nuxt.options.llms = defu(nuxt.options.llms, {
      domain: url || 'https://example.com',
      title: siteName,
      description: meta.description || '',
      full: {
        title: siteName,
        description: meta.description || ''
      }
    })

    nuxt.options.site = defu(nuxt.options.site, {
      url,
      name: siteName,
      debug: false
    })

    nuxt.options.robots = defu(nuxt.options.robots, {
      sitemap: url ? `${url.replace(/\/$/, '')}/sitemap.xml` : undefined
    })

    nuxt.options.appConfig.header = defu(nuxt.options.appConfig.header, {
      title: siteName
    })

    nuxt.options.appConfig.seo = defu(nuxt.options.appConfig.seo, {
      titleTemplate: `%s - ${siteName}`,
      title: siteName,
      description: meta.description || ''
    })

    nuxt.options.appConfig.github = defu(nuxt.options.appConfig.github, {
      owner: gitInfo?.owner,
      name: gitInfo?.name,
      url: gitInfo?.url,
      commitPath: 'src',
      suffix: 'vue',
      since: '2025-01-31T04:00:00Z',
      branch: getGitBranch(),
      per_page: 100,
      until: new Date().toISOString()
    })

    const layerPath = resolve('..')
    const allowedComponents = [
      resolve('../app/components/content/CommitChangelog.vue'),
      resolve('../app/components/content/ComponentEmits.vue'),
      resolve('../app/components/content/ComponentExample.vue'),
      resolve('../app/components/content/ComponentProps.vue'),
      resolve('../app/components/content/ComponentSlots.vue'),
      resolve('../app/components/content/PageLastCommit.vue'),
      resolve('./ai-chat/runtime/components/AiChatToolCall.vue'),
      resolve('./ai-chat/runtime/components/AiChatReasoning.vue'),
      resolve('./ai-chat/runtime/components/AiChatSlideoverFaq.vue'),
      resolve('./ai-chat/runtime/components/AiChatPreStream.vue')
    ]
    const userComponentPaths = [
      join(dir, 'app/components'),
      join(dir, 'components'),
      join(dir, 'docs/app/components'),
      join(dir, 'templates/*/app/components')
    ]

    // @ts-ignore - component-meta 的类型定义在运行时才能正确解析
    nuxt.hook('component-meta:extend', (options: any) => {
      options.exclude = [
        ...(options.exclude || []),
        ({ filePath }: { filePath: string }) =>
          filePath.startsWith(layerPath) && !allowedComponents.includes(filePath),
        ({ filePath }: { filePath: string }) =>
          userComponentPaths.some(path => filePath.startsWith(path))
      ]
    })
  }
})
