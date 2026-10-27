import { computed, ref } from 'vue'

/** AI Chat 关闭时替代 useAIChat，返回结构一致但不依赖 ai 包 */
export function useAIChat() {
  return {
    isEnabled: computed(() => false),
    isOpen: ref(false),
    messages: ref<unknown[]>([]),
    currentPage: computed(() => ''),
    toggleChat() {},
    open(_text: string) {}
  }
}
