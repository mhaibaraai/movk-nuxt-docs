<script setup lang="ts">
const route = useRoute()
const { footer } = useAppConfig()
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
      <MDC v-if="footer?.credits" :value="footer.credits" unwrap="p" />
    </template>

    <template #right>
      <template v-if="footer.socials?.length">
        <UTooltip
          v-for="(link, count) in footer.socials"
          :key="count"
          :text="link.label || (link as any)['aria-label']"
          class="hidden lg:flex"
        >
          <UButton v-bind="{ color: 'neutral', variant: 'ghost', ...link }" />
        </UTooltip>
      </template>
    </template>
  </UFooter>
</template>
