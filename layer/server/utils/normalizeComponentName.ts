import { kebabCase, pascalCase } from 'scule'

function getTrimmedComponentName(componentName: string): string {
  return componentName.trim().replace(/\.vue$/i, '')
}

export function buildComponentNameCandidates(componentName: string): {
  displayNames: string[]
  metaNames: string[]
  pathNames: string[]
} {
  const trimmedName = getTrimmedComponentName(componentName)
  const displayNames = new Set<string>()
  const metaNames = new Set<string>()
  const pathNames = new Set<string>()

  for (const name of [trimmedName, pascalCase(trimmedName)]) {
    if (name) {
      displayNames.add(name)
      metaNames.add(name)
    }
  }

  const pathName = kebabCase(trimmedName)
  if (pathName) {
    pathNames.add(pathName)
  }

  return {
    displayNames: [...displayNames],
    metaNames: [...metaNames],
    pathNames: [...pathNames]
  }
}

export function normalizeComponentName(componentName: string, fallbackName?: string): string {
  const candidates = buildComponentNameCandidates(fallbackName || componentName)
  return candidates.displayNames[0] || getTrimmedComponentName(componentName)
}
