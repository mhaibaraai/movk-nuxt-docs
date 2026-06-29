export function useCategory() {
  return {
    categories: computed(() => ({} as Record<string, { id: string, title: string, icon: string }[]>))
  }
}
