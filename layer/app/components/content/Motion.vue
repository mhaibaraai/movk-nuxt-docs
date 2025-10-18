<script lang="ts" setup>
import type { Options } from 'motion-v'
import { Motion } from 'motion-v'

const {
  initial = { scale: 1.1, opacity: 0, filter: 'blur(20px)' },
  animate = { scale: 1, opacity: 1, filter: 'blur(0px)' },
  transition = { duration: 0.6, delay: 0.1 }
} = defineProps<Options>()
</script>

<template>
  <Motion
    :initial="initial"
    :animate="animate"
    :transition="transition"
    v-bind="$attrs"
  >
    <slot />
  </Motion>
</template>
