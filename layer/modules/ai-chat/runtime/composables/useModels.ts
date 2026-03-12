export function useModels() {
  const config = useRuntimeConfig()
  const model = useCookie<string>('model', { default: () => config.public.aiChat.model })

  const { aiChat } = useAppConfig()
  const providerIcons = computed(() => aiChat.icons.providers || {})

  function getModelIcon(modelId: string): string {
    const provider = modelId.split('/')[0] || ''
    return providerIcons.value[provider] || `i-simple-icons-${modelId.split('/')[0]}`
  }

  function formatModelName(modelId: string): string {
    const acronyms = ['gpt', 'llm', 'ai'] // words that should be uppercase

    // 处理常规模型格式:provider/model
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

  return {
    models: config.public.aiChat.models,
    model,
    formatModelName,
    getModelIcon
  }
}
