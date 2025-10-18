export function useCategory() {
  return {
    categories: {} as Record<string, { id: string, title: string, icon: string }[]>
  }
}
