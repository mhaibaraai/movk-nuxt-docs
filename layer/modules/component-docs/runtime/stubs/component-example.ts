import type { ComponentExampleData } from '../example'

// componentDocs 关闭时替代 #component-example/nitro
export async function getComponentExample(_name: string): Promise<ComponentExampleData | null> {
  return null
}

export async function listComponentExamples(): Promise<string[]> {
  return []
}
