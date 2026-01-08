<script lang="ts" setup>
const { footer } = useAppConfig()
</script>

<template>
  <UTooltip
    v-for="(link, count) in footer.socials"
    :key="count"
    :text="link.label || (link as any)['aria-label']"
    class="hidden lg:flex"
  >
    <UButton v-bind="{ color: 'neutral', variant: 'ghost', ...link }" />
  </UTooltip>
</template>
