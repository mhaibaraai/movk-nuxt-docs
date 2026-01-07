<script lang="ts" setup>
const { footer } = useAppConfig()
</script>

<template>
  <MDC v-if="footer?.credits" :value="footer.credits" unwrap="p" />
</template>
