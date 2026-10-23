<script lang="ts" setup>
const config = useRuntimeConfig().public
const { header } = useAppConfig()
const { localePath } = useMovkI18n()
const logoRef = ref()

const logoTo = computed(() => header.to?.startsWith('/') ? localePath(header.to) : header.to)

const toast = useToast()
const { copy } = useClipboard()

const items = [
  [{
    label: 'Copy logo as SVG',
    icon: 'i-simple-icons-nuxt',
    onSelect() {
      if (!logoRef.value) {
        return
      }

      copy(logoRef.value.$el.outerHTML)

      toast.add({
        title: 'logo copied as SVG',
        description: 'You can now paste it into your project',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    }
  }]
]
</script>

<template>
  <div class="flex items-center gap-3 min-w-0" aria-label="Site Logo">
    <UContextMenu :items="items">
      <NuxtLink :to="logoTo" class="font-display text-xl font-bold tracking-tight text-highlighted shrink-0 rounded-sm outline-primary/25 focus-visible:outline-3" aria-label="Movk Nuxt Docs">
        Movk Nuxt Docs<span class="text-primary">.</span>
      </NuxtLink>
    </UContextMenu>

    <span class="kicker truncate">v{{ config.version }}</span>

    <Logo ref="logoRef" class="hidden" aria-hidden="true" />
  </div>
</template>
