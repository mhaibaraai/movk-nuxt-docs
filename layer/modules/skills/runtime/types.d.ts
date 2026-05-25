interface SkillEntry {
  name: string
  description: string
  files: string[]
}

declare module 'nitropack/types' {
  interface NitroRuntimeConfig {
    skills: {
      catalog: SkillEntry[]
    }
  }
}

export {}
