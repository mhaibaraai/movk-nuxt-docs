import type { SkillEntry } from '../../types'

export default defineEventHandler((event) => {
  const { skills } = useRuntimeConfig(event)
  const catalog = (skills as { catalog: SkillEntry[] }).catalog

  setResponseHeader(event, 'content-type', 'application/json')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600')

  return { skills: catalog }
})
