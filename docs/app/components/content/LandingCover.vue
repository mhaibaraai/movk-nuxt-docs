<script setup lang="ts">
defineProps<{
  /** 封面左上角的等宽小标签 */
  kicker?: string
  /** 封面右上角的等宽小标签 */
  aside?: string
}>()

const { version } = useRuntimeConfig().public
</script>

<template>
  <section class="border-b border-default">
    <UContainer class="pt-12 pb-16 lg:pt-16 lg:pb-24">
      <div class="flex items-center justify-between gap-6 kicker">
        <span><span class="text-primary">v{{ version }}</span> · {{ kicker }}</span>
        <span v-if="aside" class="hidden sm:inline">{{ aside }}</span>
      </div>

      <div class="rule-double mt-4" />

      <h1 class="mt-10 font-display font-bold tracking-tight leading-[0.95] text-balance text-highlighted text-[clamp(3rem,8.5vw,7.5rem)]">
        <slot name="title" mdc-unwrap="p" />
      </h1>

      <div class="mt-12 lg:mt-16 grid gap-12 lg:grid-cols-12">
        <div class="lg:col-span-5">
          <p class="text-xl/relaxed text-toned text-pretty">
            <slot name="description" mdc-unwrap="p" />
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <slot name="links" />
          </div>
        </div>

        <div class="lg:col-span-7 min-w-0 [&>div]:my-0">
          <slot />
        </div>
      </div>
    </UContainer>
  </section>
</template>
