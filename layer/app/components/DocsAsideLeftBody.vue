<script lang="ts" setup>
import { useFilter } from '@nuxt/ui/composables'
import { useResizeObserver } from '@vueuse/core'

const route = useRoute()
const navigation = useDocsNavigation()
const searchTerm = inject<Ref<string>>('docsFilterSearch', ref(''), false)

const { scoreItem } = useFilter()
const { navigationByCategory } = useNavigation(navigation)

const filteredNavigation = computed(() =>
  filterNavigation(navigationByCategory.value, searchTerm.value, scoreItem)
)

const navigationKey = computed(() => route.params.slug?.[0] as string ?? '')

// 当前项指示条：读取当前链接相对容器的位置，随路由与过滤结果平滑移动
const container = useTemplateRef<HTMLElement>('container')
const indicator = ref<{ top: number, height: number } | null>(null)

function measure() {
  const root = container.value
  const link = root?.querySelector<HTMLElement>(`a[data-slot="link"][href=${JSON.stringify(route.path)}]`)
  if (!root || !link) {
    indicator.value = null
    return
  }
  const rect = link.getBoundingClientRect()
  indicator.value = { top: rect.top - root.getBoundingClientRect().top, height: rect.height }
}

watch([() => route.path, filteredNavigation], () => nextTick(measure), { flush: 'post' })
onMounted(measure)
useResizeObserver(container, measure)
</script>

<template>
  <div :key="navigationKey" ref="container" class="relative flex flex-col">
    <span
      class="absolute start-0 top-0 w-0.5 bg-primary transition-[translate,height,opacity] duration-500 ease-editorial"
      :class="indicator ? 'opacity-100' : 'opacity-0'"
      :style="indicator ? { translate: `0 ${indicator.top + 8}px`, height: `${indicator.height - 16}px` } : undefined"
      aria-hidden="true"
    />

    <section
      v-for="(group, index) in filteredNavigation"
      :key="group.path"
      class="py-5 first:pt-0 border-b border-default last:border-b-0"
    >
      <p class="mb-2.5 flex items-baseline gap-2.5 text-[13px] font-semibold text-highlighted">
        <span class="font-mono text-[11px] font-normal tracking-[0.12em] text-primary">{{ String(index + 1).padStart(2, '0') }}</span>
        {{ group.title }}
      </p>

      <UContentNavigation
        :collapsible="false"
        :navigation="group.children"
        color="neutral"
      />
    </section>
  </div>
</template>
