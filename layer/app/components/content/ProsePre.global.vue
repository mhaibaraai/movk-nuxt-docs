<script setup lang="ts">
// 源自 Nuxt UI runtime/components/prose/Pre.vue，替换复制按钮为「复制 / 已复制」文字反馈，并把 mermaid 代码块交给 ProseMermaid；同步上游时需对照 props 与模板
// 以 .global 注册，MDCRenderer 运行时解析（ComponentCode / ComponentExample）才能找到该覆盖
import theme from '#build/ui/prose/pre'
import { useClipboard } from '@vueuse/core'
import { useLocale } from '@nuxt/ui/composables'
import { tv } from '@nuxt/ui/utils/tv'

const props = withDefaults(defineProps<{
  icon?: string
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  hideHeader?: boolean
  meta?: string
  copy?: boolean
  class?: any
  ui?: Record<string, any>
}>(), {
  copy: true
})

const { t: tUi } = useLocale()
const { t } = useMovkI18n()
const { copy: copyToClipboard, copied } = useClipboard({ copiedDuring: 2000 })
const appConfig = useAppConfig() as ReturnType<typeof useAppConfig> & { ui: { prose?: { pre?: Partial<typeof theme> } } }
const baseRef = useTemplateRef('baseRef')

type PreSlot = 'root' | 'header' | 'icon' | 'filename' | 'copy' | 'base'
type PreStyles = Record<PreSlot, (options?: { class?: unknown, filename?: boolean }) => string>

// 使用方环境中 #build 主题的类型可能无法推断，显式声明各插槽的类名函数
const styles = computed(() => tv({ extend: tv(theme), ...(appConfig.ui.prose?.pre || {}) })() as unknown as PreStyles)

// movkNuxtDocs.mermaid 开启时才会注册 ProseMermaid，未注册则按普通代码块展示
const mermaid = computed(() => {
  if (props.language !== 'mermaid') return null
  const resolved = resolveComponent('ProseMermaid')
  return typeof resolved === 'string' ? null : resolved
})

function copyCode() {
  copyToClipboard(props.code ?? baseRef.value?.textContent ?? '')
}
</script>

<template>
  <component
    :is="mermaid"
    v-if="mermaid"
    :code="props.code || ''"
    :filename="props.filename"
    :icon="props.icon"
  />

  <div v-else :class="styles.root({ class: [props.ui?.root], filename: !!props.filename })">
    <div v-if="props.filename && !props.hideHeader" :class="styles.header({ class: props.ui?.header })">
      <ProseCodeIcon :icon="props.icon" :filename="props.filename" :class="styles.icon({ class: props.ui?.icon })" />

      <span :class="styles.filename({ class: props.ui?.filename })">{{ props.filename }}</span>
    </div>

    <button
      v-if="props.copy"
      type="button"
      :aria-label="tUi('prose.pre.copy')"
      :class="styles.copy({ class: [props.ui?.copy, copied ? 'text-primary opacity-100!' : 'text-muted hover:text-highlighted'] })"
      @click="copyCode"
    >
      <UIcon :name="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy" class="size-3.5" />
      <span aria-live="polite">{{ copied ? t('docs.codeCopied') : t('docs.copyCode') }}</span>
    </button>

    <pre ref="baseRef" :class="styles.base({ class: [props.ui?.base, props.class] })" v-bind="$attrs"><slot /></pre>
  </div>
</template>
