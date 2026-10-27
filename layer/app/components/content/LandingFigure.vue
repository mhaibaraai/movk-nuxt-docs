<script setup lang="ts">
defineProps<{
  src: string
  /** 暗色模式下的图片，留空则始终使用 src */
  dark?: string
  alt: string
  /** 图注，前面自动加「图」编号标签 */
  caption?: string
  /** 图注编号标签 */
  label?: string
}>()
</script>

<template>
  <figure class="mt-12">
    <div class="border border-default bg-muted overflow-hidden max-h-[34rem]">
      <UColorModeImage
        v-if="dark"
        :light="src"
        :dark="dark"
        :alt="alt"
        class="w-full object-cover object-top"
        loading="lazy"
      />
      <img
        v-else
        :src="src"
        :alt="alt"
        class="w-full object-cover object-top"
        loading="lazy"
      >
    </div>
    <figcaption v-if="caption" class="mt-3 text-sm text-muted">
      <span v-if="label" class="kicker me-2 text-highlighted">{{ label }}</span>{{ caption }}
    </figcaption>
  </figure>
</template>
