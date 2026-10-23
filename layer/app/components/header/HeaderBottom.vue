<script setup lang="ts">
const route = useRoute()
const { t } = useMovkI18n()

const navigation = useDocsNavigation()

const items = computed(() => (navigation.value ?? []).map((item, index) => ({
  label: item.title,
  to: item.path,
  index: String(index + 1).padStart(2, '0'),
  active: route.path.startsWith(item.path)
})))
</script>

<template>
  <nav class="hidden lg:block h-12 border-t border-default" :aria-label="t('header.categoryNavigation')">
    <UContainer class="flex items-stretch gap-9 h-full">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :aria-current="item.active ? 'page' : undefined"
        class="group relative flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
        :class="item.active ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
      >
        <span class="transition-colors" :class="item.active ? 'text-primary' : 'text-dimmed group-hover:text-primary'">{{ item.index }}</span>
        {{ item.label }}
        <span
          class="absolute inset-x-0 -bottom-px h-0.5 bg-inverted origin-left transition-transform duration-500 ease-editorial"
          :class="item.active ? 'scale-x-100' : 'scale-x-0'"
          aria-hidden="true"
        />
      </NuxtLink>
    </UContainer>
  </nav>
</template>
