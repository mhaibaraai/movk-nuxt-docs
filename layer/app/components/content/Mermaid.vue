<script setup lang="ts">
import { hash } from 'ohash'
import type { IconProps } from '@nuxt/ui'
import type { ClassNameValue } from 'tailwind-merge'
import DOMPurify from 'isomorphic-dompurify'
import {
  useClipboard,
  useElementVisibility,
  useEventListener,
  useToggle
} from '@vueuse/core'
import { tv } from '@nuxt/ui/utils/tv'

const theme = {
  slots: {
    root: 'relative my-5 group border border-muted rounded-md overflow-hidden',
    header: 'flex items-center gap-1.5 border-b border-muted bg-default px-4 py-3',
    filename: 'text-default text-sm/6',
    icon: 'size-4 shrink-0',
    toolbar: 'absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity',
    diagram: 'p-4 flex justify-center bg-elevated overflow-x-auto',
    loading: 'p-4 flex items-center justify-center gap-2 text-sm text-muted',
    error: 'p-4 flex items-center justify-center gap-2 text-sm text-error bg-error/10'
  },
  variants: {
    fullscreen: {
      true: {
        root: 'fixed inset-0 z-50 m-0 rounded-none bg-default flex flex-col',
        diagram: 'flex-1 overflow-auto',
        toolbar: 'opacity-100'
      }
    },
    filename: {
      true: {
        root: ''
      }
    }
  }
}

export interface MermaidProps {
  /** 图表代码 */
  code: string
  /**
   * 图标
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /** 文件名 */
  filename?: string
  class?: ClassNameValue
  ui?: Partial<typeof theme.slots>
}

export interface MermaidSlots {
  default?(props: {}): any
}

const props = defineProps<MermaidProps>()

defineSlots<MermaidSlots>()

const appConfig = useAppConfig() as { ui?: { icons?: { copy?: string, copyCheck?: string }, prose?: { mermaid?: typeof theme } } }
const colorMode = useColorMode()

const ui = computed(() => tv({
  extend: tv(theme),
  ...(appConfig.ui?.prose?.mermaid || {})
})({
  fullscreen: isFullscreen.value,
  filename: !!props.filename
}))

const copyIcon = computed(() => appConfig.ui?.icons?.copy || 'i-lucide-copy')
const copyCheckIcon = computed(() => appConfig.ui?.icons?.copyCheck || 'i-lucide-check')

const mermaidId = computed(() => `mermaid-${hash(props.code)}`)
const mermaidTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'default')

const containerRef = ref<HTMLElement | null>(null)
const diagramRef = ref<HTMLElement | null>(null)
const isRendered = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

const [isFullscreen, toggleFullscreen] = useToggle(false)
const { copy, copied } = useClipboard({ source: () => props.code })
const isVisible = useElementVisibility(containerRef)

async function renderMermaid() {
  if (!props.code || isRendered.value || !diagramRef.value) return

  try {
    const mermaid = await import('mermaid').then(m => m.default)
    mermaid.initialize({
      startOnLoad: false,
      theme: mermaidTheme.value,
      securityLevel: 'strict',
      fontFamily: 'inherit'
    })

    const { svg } = await mermaid.render(mermaidId.value, props.code)
    const sanitized = DOMPurify.sanitize(svg, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ['foreignObject']
    })
    diagramRef.value.innerHTML = sanitized
    isRendered.value = true
  } catch (e) {
    hasError.value = true
    errorMessage.value = e instanceof Error ? e.message : 'Mermaid render failed'
    console.error('[Mermaid]', errorMessage.value)
  }
}

async function reRender() {
  if (!diagramRef.value) return
  isRendered.value = false
  hasError.value = false
  diagramRef.value.innerHTML = ''
  await renderMermaid()
}

watch(
  [isVisible, diagramRef],
  ([visible, el]) => {
    if (visible && el && !isRendered.value) {
      renderMermaid()
    }
  },
  { immediate: true }
)

watch(mermaidTheme, () => {
  if (isRendered.value) reRender()
})

watch(() => props.code, () => {
  if (isVisible.value) reRender()
})

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
})
</script>

<template>
  <div ref="containerRef" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="filename" :class="ui.header({ class: props.ui?.header })">
      <UIcon v-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
      <ProseCodeIcon v-else :filename="filename" :class="ui.icon({ class: props.ui?.icon })" />
      <span :class="ui.filename({ class: props.ui?.filename })">{{ filename }}</span>
    </div>

    <div v-if="isRendered" :class="ui.toolbar({ class: props.ui?.toolbar })">
      <UButton
        :icon="copied ? copyCheckIcon : copyIcon"
        color="neutral"
        variant="ghost"
        size="xs"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy()"
      />
      <UButton
        :icon="isFullscreen ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
        color="neutral"
        variant="ghost"
        size="xs"
        :aria-label="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
        @click="toggleFullscreen()"
      />
    </div>

    <div v-if="hasError" :class="ui.error({ class: props.ui?.error })">
      <UIcon name="i-lucide-alert-triangle" class="size-4" />
      <span>{{ errorMessage }}</span>
    </div>

    <template v-else>
      <div v-if="!isRendered" :class="ui.loading({ class: props.ui?.loading })">
        <UIcon name="i-lucide-loader-2" class="size-4 animate-spin" />
        <span>Loading diagram...</span>
      </div>
      <div v-show="isRendered" ref="diagramRef" :class="ui.diagram({ class: props.ui?.diagram })" />
    </template>
  </div>
</template>

<style>
[class*="diagram"] :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
