<template>
  <div>
    <h3>Enum Test Component</h3>
    <p>Color: {{ color }}</p>
    <p>Size: {{ size }}</p>
    <p>Variant: {{ variant }}</p>
    <slot />
    <slot name="avatar" :src="avatar?.src ?? ''" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  /**
   * @defaultValue 'primary'
   */
  color?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'
  /**
   * @defaultValue 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * The variant of the component
   * @defaultValue 'solid'
   */
  variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
  disabled?: boolean
  label?: string
  /**
   * display an avatar
   */
  avatar?: {
    src: string
    alt?: string
    text?: string
    chip?: boolean | 'circle'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  }
}

defineProps<Props>()

defineSlots<{
  /**
   * 默认内容插槽
   */
  default(props?: {}): any
  /**
   * 头像插槽，作用域暴露头像地址
   * @see https://ui.nuxt.com/components/avatar
   */
  avatar(props: { src: string }): any
}>()

defineEmits<{
  /**
   * 值变化时触发
   * @see https://vuejs.org/guide/components/events.html
   */
  change: [value: string]
  /**
   * 删除时触发
   */
  delete: []
}>()
</script>
