import type { ComponentMeta } from 'vue-component-meta'
import { useAsyncData, useRequestEvent } from '#imports'

export interface ComponentMetaData {
  meta: ComponentMeta
}

export function useFetchComponentMeta(name: string) {
  const event = import.meta.server ? useRequestEvent() : undefined

  return useAsyncData<Partial<ComponentMetaData>>(`component-meta-${name}`, async () => {
    let missing = false
    const meta = await $fetch<ComponentMetaData>(`/api/component-meta/${name}.json`).catch((error: unknown) => {
      missing = typeof error === 'object' && error !== null && 'statusCode' in error && error.statusCode === 404
      return null
    })
    // 外部组件可没有元数据；其他请求失败仍发布接口链接，由预渲染暴露错误。
    if (!missing && event) {
      event.node.res.setHeader(
        'x-nitro-prerender',
        [event.node.res.getHeader('x-nitro-prerender'), `/api/component-meta/${name}.json`].filter(Boolean).join(',')
      )
    }
    return meta ?? {}
  }, {
    lazy: import.meta.client,
    dedupe: 'defer',
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
  })
}
