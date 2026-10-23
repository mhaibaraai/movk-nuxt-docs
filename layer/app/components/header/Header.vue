<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { header, github } = useAppConfig()
const isDocsRoute = useDocsRoute()
const { t, isEnabled, locales } = useMovkI18n()

const links = computed<ButtonProps[]>(() => (github && github.url
  ? [
      {
        'icon': 'i-simple-icons-github',
        'to': github.url,
        'target': '_blank',
        'aria-label': 'GitHub'
      },
      ...(header?.links || [])
    ]
  : header?.links || []) as ButtonProps[])
</script>

<template>
  <UHeader
    :ui="{
      root: 'bg-default backdrop-blur-none border-inverted',
      left: 'min-w-0',
      center: 'lg:ms-10 lg:me-auto',
      right: 'gap-0.5 lg:flex-none'
    }"
    :aria-label="t('header.site')"
    class="flex flex-col"
  >
    <template #left>
      <HeaderLogo />
    </template>

    <HeaderCenter />

    <template #right>
      <template v-if="header?.search">
        <UContentSearchButton
          :collapsed="false"
          :label="t('header.search')"
          color="neutral"
          class="hidden lg:inline-flex w-56 me-2 rounded-none ring-default text-muted hover:text-highlighted hover:ring-inverted"
          :ui="{ trailing: 'ms-auto' }"
        />
        <UContentSearchButton class="lg:hidden" />
      </template>

      <HeaderCTA />

      <span class="hidden lg:block h-5 border-s border-default mx-1.5" aria-hidden="true" />

      <ThemePicker />

      <UTooltip :text="t('header.colorMode')">
        <UColorModeButton v-if="header?.colorMode" :aria-label="t('header.colorMode')" />
      </UTooltip>

      <template v-if="isEnabled && locales.length > 1">
        <ClientOnly>
          <LanguageSwitcher />

          <template #fallback>
            <div class="h-8 w-8 animate-pulse bg-elevated rounded-md" />
          </template>
        </ClientOnly>
      </template>

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

    <template #toggle="{ open, toggle, ui }">
      <HeaderToggleButton :open="open" :class="ui.toggle({ toggleSide: 'right' })" @click="toggle" />
    </template>

    <template #body>
      <HeaderBody />
    </template>

    <template v-if="isDocsRoute" #bottom>
      <HeaderBottom />
    </template>
  </UHeader>
</template>
