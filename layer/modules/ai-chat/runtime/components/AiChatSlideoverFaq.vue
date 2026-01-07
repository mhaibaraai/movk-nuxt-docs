<script lang="ts" setup>
export interface FaqCategory {
  category: string
  items: string[]
}

defineProps<{
  /**
   * 聊天为空时显示的常见问题分类
   */
  faqQuestions: FaqCategory[]
}>()

defineEmits<{
  (e: 'ask-question', question: string): void
}>()
</script>

<template>
  <div class="flex flex-col gap-5">
    <div
      v-for="category in faqQuestions"
      :key="category.category"
      class="flex flex-col gap-1.5"
    >
      <h4 class="text-xs font-medium text-dimmed uppercase tracking-wide">
        {{ category.category }}
      </h4>
      <div class="flex flex-col">
        <button
          v-for="question in category.items"
          :key="question"
          class="text-left text-sm text-muted hover:text-highlighted py-1.5 transition-colors"
          @click="$emit('ask-question', question)"
        >
          {{ question }}
        </button>
      </div>
    </div>
  </div>
</template>
