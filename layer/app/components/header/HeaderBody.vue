<script setup lang="ts">
const { mobileLinks } = useHeader()
const { t } = useMovkI18n()
const isDocsRoute = useDocsRoute()
</script>

<template>
  <nav :aria-label="t('header.mobileNavigation')">
    <NuxtLink
      v-for="(link, index) in mobileLinks"
      :key="link.to"
      :to="link.to"
      :target="link.target"
      class="flex items-baseline gap-4 border-b border-default py-3.5"
    >
      <span class="font-mono text-[11px] tracking-[0.14em]" :class="link.active ? 'text-primary' : 'text-dimmed'">
        {{ String(index + 1).padStart(2, '0') }}
      </span>
      <span class="font-display text-xl font-bold" :class="link.active ? 'text-highlighted' : 'text-toned'">
        {{ link.label }}
      </span>
    </NuxtLink>
  </nav>

  <template v-if="isDocsRoute">
    <p class="kicker mt-8 mb-4">
      {{ t('header.docsNavigation') }}
    </p>

    <DocsAsideLeftBody />
  </template>
</template>
