<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <USeparator :icon="route.path === '/' ? undefined : 'i-simple-icons-nuxtdotjs'" class="h-px" />

  <UFooter
    :ui="{
      left: 'text-sm text-muted',
      root: 'border-t border-default'
    }"
  >
    <template #left>
      <FooterLeft />
    </template>

    <template #right>
      <FooterRight />
    </template>
  </UFooter>
</template>
