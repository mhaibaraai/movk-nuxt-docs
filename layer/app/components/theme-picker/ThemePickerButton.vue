<script setup lang="ts">
import { paletteShade } from '../../utils/theme-palette'

defineProps<{
  label: string
  icon?: string
  chip?: string
  selected?: boolean
}>()

const slots = defineSlots<{
  leading: () => any
}>()
</script>

<template>
  <UButton
    size="sm"
    color="neutral"
    variant="outline"
    :icon="icon"
    :label="label"
    class="capitalize ring-default rounded-sm text-[11px]"
    :class="selected ? 'bg-soft' : 'hover:bg-soft/50'"
  >
    <template v-if="chip || !!slots.leading" #leading>
      <slot name="leading">
        <span
          class="inline-block size-2 rounded-full bg-(--color-light) dark:bg-(--color-dark)"

          :style="{
            '--color-light': paletteShade(chip || '', 500),
            '--color-dark': paletteShade(chip || '', 400)
          }"
        />
      </slot>
    </template>
  </UButton>
</template>
