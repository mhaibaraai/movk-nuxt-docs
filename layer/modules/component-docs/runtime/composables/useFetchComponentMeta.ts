import type { ComponentMeta } from 'vue-component-meta'
import { useAsyncData, useRequestEvent } from '#imports'

export interface ComponentMetaData {
  meta: ComponentMeta
}

export function useFetchComponentMeta(name: string) {
  if (import.meta.server) {
    const event = useRequestEvent()
    event?.node.res.setHeader(
      'x-nitro-prerender',
      [event?.node.res.getHeader('x-nitro-prerender'), `/api/component-meta/${name}.json`].filter(Boolean).join(',')
    )
  }

  return useAsyncData<Partial<ComponentMetaData>>(`component-meta-${name}`, () => $fetch<ComponentMetaData>(`/api/component-meta/${name}.json`).catch(() => ({})), {
    lazy: import.meta.client,
    dedupe: 'defer',
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
  })
}
