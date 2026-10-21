import { existsSync } from 'node:fs'
import { join } from 'pathe'
import { addComponent, addComponentsDir, addImportsDir, addPlugin, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { ModuleDependencies } from 'nuxt/schema'
import { getFeatures } from '../../utils/features'
import { assertFeatureDependencies } from '../../utils/feature-dependencies'
import { createComponentMetaExcludeFilters } from '../../utils/component-meta'
import { applyEmitDocs } from '../../utils/component-meta-emits'
import { setupCodeRegistry } from './code-registry'
import { setupExamples } from './examples'

const COMPONENT_META_DEFAULTS = {
  metaFields: {
    type: false,
    props: true,
    slots: 'no-schema' as const,
    events: 'no-schema' as const,
    exposed: false
  },
  exclude: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/mdc',
    '@nuxtjs/plausible',
    '@comark/vue',
    'nuxt/dist',
    'nuxt-og-image',
    // 以下模块的组件以包名注册，晚于它们安装 component-meta 时会被扫描到，需显式排除
    '@unhead/schema-org',
    'nuxt-schema-org',
    'motion-v',
    '@nuxtjs/i18n',
    '@nuxt/a11y'
  ]
}

/**
 * 组件文档：ComponentProps / Slots / Emits / Code / Example 及其数据来源。
 * 由 movkNuxtDocs.componentDocs 控制；关闭时服务端虚拟模块指向空实现，transformMDC 与 MCP 无需判断
 */
export default defineNuxtModule({
  meta: {
    name: 'movk-component-docs'
  },
  moduleDependencies(nuxt): ModuleDependencies {
    assertFeatureDependencies(nuxt)
    return getFeatures(nuxt).componentDocs
      ? { 'nuxt-component-meta': { defaults: COMPONENT_META_DEFAULTS } }
      : {}
  },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // 无论开关与否都声明虚拟模块类型：关闭时由空实现提供，开启时由模块在构建期生成
    addTypeTemplate({
      filename: 'types/movk-component-docs.d.ts',
      getContents: () => `declare module '#component-code/registry' {
  import type { Component } from 'vue'
  export const registry: Record<string, Component>
}

declare module '#component-example/nitro' {
  import type { ComponentExampleData } from '${resolve('./runtime/example')}'
  export function getComponentExample(name: string): Promise<ComponentExampleData | null>
  export function listComponentExamples(): Promise<string[]>
}

declare module '#nuxt-component-meta/nitro' {
  const meta: Record<string, { meta?: Record<string, any> }>
  export default meta
}
`
    }, { nuxt: true, nitro: true })

    if (!getFeatures(nuxt).componentDocs) {
      nuxt.hook('nitro:config', (nitroConfig) => {
        nitroConfig.alias = {
          ...nitroConfig.alias,
          '#nuxt-component-meta/nitro': resolve('./runtime/stubs/component-meta'),
          '#component-example/nitro': resolve('./runtime/stubs/component-example')
        }
      })
      return
    }

    addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      global: true,
      ignore: ['ComponentExampleExtras.vue']
    })

    const consumerExtras = [
      join(nuxt.options.srcDir, 'components/content/ComponentExampleExtras.vue'),
      join(nuxt.options.rootDir, 'app/components/content/ComponentExampleExtras.vue')
    ].find(existsSync)

    addComponent({
      name: 'ComponentExampleExtras',
      filePath: consumerExtras ?? resolve('./runtime/components/ComponentExampleExtras.vue')
    })

    addImportsDir(resolve('./runtime/composables'))
    addPlugin(resolve('./runtime/plugins/prettier'))

    setupCodeRegistry(nuxt)
    setupExamples(nuxt)

    const layerPath = resolve('../..')
    const allowedComponents = [
      'ComponentProps',
      'ComponentSlots',
      'ComponentEmits',
      'ComponentCode',
      'ComponentExample'
    ].map(name => resolve(`./runtime/components/${name}.vue`)).concat([
      resolve('../../app/components/content/CommitChangelog.vue'),
      resolve('../../app/components/content/PageLastCommit.vue'),
      resolve('../components/prose/Mermaid.vue')
    ])

    // @ts-expect-error - component-meta 钩子未声明类型
    nuxt.hook('component-meta:extend', (options: any) => {
      const componentMeta = (nuxt.options as { componentMeta?: { include?: Array<string | RegExp | ((component: { filePath: string, pascalName: string }) => boolean)> } }).componentMeta
      const userInclude = componentMeta?.include || []

      options.exclude = [
        ...(options.exclude || []),
        ...createComponentMetaExcludeFilters(allowedComponents, nuxt.options.rootDir, layerPath, userInclude)
      ]
    })

    // @ts-expect-error - component-meta 钩子未声明类型
    nuxt.hook('component-meta:schema', (schema: any) => applyEmitDocs(schema))

    nuxt.hook('vite:extendConfig', (config) => {
      const cfg = config as { optimizeDeps?: { include?: string[] } }
      cfg.optimizeDeps ??= {}
      cfg.optimizeDeps.include ??= []
      cfg.optimizeDeps.include.push('@movk/nuxt-docs > prettier')
    })
  }
})
