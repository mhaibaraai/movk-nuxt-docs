<script setup lang="ts">
defineProps<{
  /** 章节编号，如 `01` */
  index: string
  /** 编号后的等宽小标签 */
  kicker?: string
}>()
</script>

<template>
  <section class="border-b border-default py-20 lg:py-28">
    <UContainer class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">
        <p class="kicker">
          <span class="text-primary">{{ index }}</span>
          <template v-if="kicker">
            — {{ kicker }}
          </template>
        </p>

        <h2 class="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance text-highlighted">
          <slot name="title" mdc-unwrap="p" />
        </h2>

        <p class="mt-5 text-lg/relaxed text-muted text-pretty">
          <slot name="description" mdc-unwrap="p" />
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <slot name="links" />
        </div>

        <slot name="aside" />
      </div>

      <div class="lg:col-span-8">
        <div class="landing-grid grid sm:grid-cols-2 border-t border-s border-default">
          <slot />
        </div>
      </div>
    </UContainer>
  </section>
</template>
