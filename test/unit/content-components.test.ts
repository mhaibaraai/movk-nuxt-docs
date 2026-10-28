import { describe, expect, it } from 'vitest'
import { contentUiComponents, mergeComponentDetection } from '../../layer/utils/content-components'

describe('contentUiComponents', () => {
  it('识别各级 MDC 语法中的 Nuxt UI 组件', () => {
    const source = `::u-page-hero
#links
  :::u-button{to="/docs"}
  快速入门
  :::
::

::u-page-section
  :::u-page-feature
  :::
::

:u-page-c-t-a{title="x"}`
    expect(contentUiComponents(source)).toEqual(['PageHero', 'Button', 'PageSection', 'PageFeature', 'PageCTA'])
  })

  it('识别 PascalCase 写法并去重', () => {
    expect(contentUiComponents('::UPageCard\n::\n::u-page-card\n::')).toEqual(['PageCard'])
  })

  it('不匹配普通文本、URL 与非 Nuxt UI 组件', () => {
    const source = `访问 https://example.com/u-button 或 user-card
::note
::
:home-hero-demo
::my-u-thing`
    expect(contentUiComponents(source)).toEqual([])
  })
})

describe('mergeComponentDetection', () => {
  it('未开启检测时保持原值', () => {
    expect(mergeComponentDetection(undefined, ['PageHero'])).toBeUndefined()
    expect(mergeComponentDetection(false, ['PageHero'])).toBe(false)
  })

  it('true 转为组件列表，数组取并集', () => {
    expect(mergeComponentDetection(true, ['PageHero'])).toEqual(['PageHero'])
    expect(mergeComponentDetection(['Sidebar', 'PageHero'], ['PageHero', 'Button'])).toEqual(['Sidebar', 'PageHero', 'Button'])
  })

  it('没有新增组件时保持原值', () => {
    const detection = ['Sidebar']
    expect(mergeComponentDetection(detection, [])).toBe(detection)
    expect(mergeComponentDetection(true, [])).toBe(true)
  })
})
