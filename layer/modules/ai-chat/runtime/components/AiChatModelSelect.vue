<script setup lang="ts">
const { model, models, formatModelName, getModelIcon } = useModels()

const items = computed(() => models.map(model => ({
  label: formatModelName(model),
  value: model,
  icon: getModelIcon(model)
})))
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="items"
    size="sm"
    :icon="getModelIcon(model)"
    variant="ghost"
    value-key="value"
    class="hover:bg-default focus:bg-default data-[state=open]:bg-default"
    :ui="{
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
  />
</template>
