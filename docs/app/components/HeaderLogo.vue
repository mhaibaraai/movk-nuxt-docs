<script lang="ts" setup>
const config = useRuntimeConfig().public
const { header } = useAppConfig()
const logoRef = ref()

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
  <div class="flex items-center gap-2" aria-label="Site Logo">
    <UContextMenu :items="items">
      <NuxtLink :to="header.to" class="flex items-end gap-2 font-bold text-xl text-highlighted min-w-0 outline-primary/25 focus-visible:outline-3 shrink-0 rounded-md p-1 -ms-1" aria-label="Movk Nuxt Docs">
        <Logo ref="logoRef" class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </UContextMenu>

    <UButton
      :label="`v${config.version}`"
      variant="subtle"
      size="xs"
      class="font-semibold rounded-full truncate"
    />
  </div>
</template>
