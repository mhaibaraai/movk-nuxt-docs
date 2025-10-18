<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const route = useRoute()
const { desktopLinks } = useHeader()
const { header, github } = useAppConfig()

const links = computed<ButtonProps[]>(() => github && github.url
  ? [
      {
        'icon': 'i-simple-icons-github',
        'to': github.url,
        'target': '_blank',
        'aria-label': 'GitHub'
      },
      ...header?.links || []
    ]
  : header.links)
</script>

<template>
  <UHeader :ui="{ left: 'min-w-0' }" class="flex flex-col">
    <template #left>
      <HeaderLogo />
    </template>

    <UNavigationMenu :items="desktopLinks" variant="link" />

    <template #right>
      <ThemePicker />

      <UTooltip text="Search" :kbds="['meta', 'K']">
        <UContentSearchButton v-if="header?.search" />
      </UTooltip>

      <UTooltip text="Color Mode">
        <UColorModeButton v-if="header?.colorMode" aria-label="Color Mode" />
      </UTooltip>

      <template v-if="links?.length">
        <UTooltip
          v-for="(link, count) in links"
          :key="count"
          :text="link.label || (link as any)['aria-label']"
          class="hidden lg:flex"
        >
          <UButton v-bind="{ color: 'neutral', variant: 'ghost', ...link }" />
        </UTooltip>
      </template>
    </template>

    <template #body>
      <HeaderBody />
    </template>

    <template v-if="route.path.startsWith('/docs/')" #bottom>
      <HeaderBottom />
    </template>
  </UHeader>
</template>
