<template>
  <div>
    <h3>Enum Test Component</h3>
    <p>Color: {{ color }}</p>
    <p>Size: {{ size }}</p>
    <p>Variant: {{ variant }}</p>
    <slot />
    <slot name="avatar" />
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
defineEmits(['change', 'delete'])
</script>
