import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { collectGroups, renderGroups, replaceRegion } from './render.ts'
import type { Locale, SchemaNode } from './render.ts'

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export const SCHEMA_FILE = resolve('../../layer/.nuxt/schema/nuxt.schema.json')
export const EN_FILE = resolve('./en.json')
export const TARGETS: Record<Locale, string> = {
  'zh-CN': resolve('../../docs/content/docs/6.reference/1.app-config.md'),
  'en': resolve('../../docs/content/en/docs/6.reference/1.app-config.md')
}

export function buildReference(locale: Locale): string {
  const schema = JSON.parse(readFileSync(SCHEMA_FILE, 'utf8')) as { properties: { appConfig: SchemaNode } }
  const en = JSON.parse(readFileSync(EN_FILE, 'utf8')) as Record<string, string>
  const groups = collectGroups(schema.properties.appConfig, locale, en)
  return replaceRegion(readFileSync(TARGETS[locale], 'utf8'), renderGroups(groups, locale))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const locale of Object.keys(TARGETS) as Locale[]) {
    writeFileSync(TARGETS[locale], buildReference(locale))
    console.log(`Updated ${TARGETS[locale]}`)
  }
}
