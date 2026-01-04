export function formatModelName(modelId: string): string {
  const acronyms = ['gpt'] // words that should be uppercase
  const modelName = modelId.split('/')[1] || modelId

  return modelName
    .split('-')
    .map((word) => {
      const lowerWord = word.toLowerCase()
      return acronyms.includes(lowerWord)
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export function useModels() {
  const config = useRuntimeConfig()
  const model = useCookie<string>('model', { default: () => config.public.aiChat.model })

  return {
    models: config.public.aiChat.models,
    model,
    formatModelName
  }
}
