<script setup lang="ts">
const { locale, locales, switchLocalePath, t } = useMovkI18n()
</script>

<template>
  <UPopover :content="{ align: 'end' }">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-languages"
      class="size-8"
      :aria-label="t('header.language')"
    />

    <template #content>
      <ul class="flex flex-col min-w-40 py-1">
        <li
          v-for="localeItem in locales"
          :key="localeItem.code"
        >
          <NuxtLink
            class="flex items-baseline justify-between gap-6 py-1.5 px-3 text-sm hover:bg-muted"
            :class="localeItem.code === locale ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
            :to="switchLocalePath(localeItem.code) as string"
            :lang="localeItem.code"
            :aria-current="localeItem.code === locale ? 'true' : undefined"
          >
            {{ localeItem.name }}
            <span class="kicker" :class="localeItem.code === locale && 'text-primary'">{{ localeItem.code }}</span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </UPopover>
</template>
