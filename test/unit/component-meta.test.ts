import { describe, expect, it } from 'vitest'
import { createComponentMetaExcludeFilters, isUserComponent } from '../../layer/utils/component-meta'

const allowed = ['/layer/modules/component-docs/runtime/components/ComponentProps.vue']
type Include = Parameters<typeof createComponentMetaExcludeFilters>[3]
type Filter = (component: { filePath: string, pascalName: string }) => boolean

const filters = (include: Include) => createComponentMetaExcludeFilters(allowed, '/site', '/layer', include) as Filter[]
const excludeLayer = (include: Include) => filters(include)[0]!
const excludeUser = (include: Include) => filters(include)[1]!

describe('component-meta 过滤器', () => {
  it('识别用户组件目录', () => {
    expect(isUserComponent('/site/app/components/A.vue', ['/site/app/components'])).toBe(true)
    expect(isUserComponent('/other/A.vue', ['/site/app/components'])).toBe(false)
  })

  it('layer 组件仅保留白名单', () => {
    const layer = excludeLayer([])
    expect(layer({ filePath: '/layer/modules/component-docs/runtime/components/ComponentProps.vue', pascalName: 'ComponentProps' })).toBe(false)
    expect(layer({ filePath: '/layer/app/components/header/Header.vue', pascalName: 'Header' })).toBe(true)
  })

  it('未配置 include 时排除全部用户组件', () => {
    const user = excludeUser([])
    expect(user({ filePath: '/site/app/components/A.vue', pascalName: 'A' })).toBe(true)
    expect(user({ filePath: '/node_modules/x/B.vue', pascalName: 'B' })).toBe(false)
  })

  it('include 支持 glob、正则与函数', () => {
    const user = excludeUser(['**/TestApi.vue', /^Keep/, c => c.pascalName === 'Fn'])
    expect(user({ filePath: '/site/app/components/TestApi.vue', pascalName: 'TestApi' })).toBe(false)
    expect(user({ filePath: '/site/app/components/x/KeepMe.vue', pascalName: 'KeepMe' })).toBe(false)
    expect(user({ filePath: '/site/components/Fn.vue', pascalName: 'Fn' })).toBe(false)
    expect(user({ filePath: '/site/app/components/Drop.vue', pascalName: 'Drop' })).toBe(true)
  })
})
