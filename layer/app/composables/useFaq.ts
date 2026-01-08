export interface FaqItem {
  category: string
  items: string[]
}

export function useFaq() {
  const faqQuestions: FaqItem[] = [
    {
      category: 'MCP 工具使用',
      items: [
        '如何查询所有可用的文档页面？',
        '如何获取特定文档页面的完整内容？',
        '什么时候应该使用 list-pages 而不是 get-page？'
      ]
    }
  ]

  return {
    faqQuestions
  }
}
