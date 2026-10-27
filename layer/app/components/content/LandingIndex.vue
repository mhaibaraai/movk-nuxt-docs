<script setup lang="ts">
defineProps<{
  /** 列表上方的等宽小标签 */
  label?: string
}>()

const navigation = useDocsNavigation()

const items = computed(() => (navigation.value ?? []).map((item, index) => ({
  index: String(index + 1).padStart(2, '0'),
  title: item.title,
  description: item.description as string | undefined,
  to: sectionLink(item)
})))
</script>

<template>
  <nav :aria-label="label" class="mt-10">
    <p v-if="label" class="kicker mb-3">
      {{ label }}
    </p>

    <ol class="border-t border-inverted">
      <li v-for="item in items" :key="item.to" class="border-b border-default">
        <NuxtLink :to="item.to" class="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-3.5">
          <span class="font-mono text-[11px] tracking-[0.12em] text-primary">{{ item.index }}</span>
          <span class="min-w-0">
            <span class="block font-display text-lg font-bold text-highlighted transition-transform duration-500 ease-editorial group-hover:translate-x-1.5">{{ item.title }}</span>
            <span v-if="item.description" class="block text-sm text-muted truncate">{{ item.description }}</span>
          </span>
          <UIcon name="i-lucide-arrow-up-right" class="size-4 text-dimmed transition-colors group-hover:text-primary" />
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>
