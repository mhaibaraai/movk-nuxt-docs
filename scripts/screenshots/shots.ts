import type { Page } from '@playwright/test'

export interface Shot {
  name: string
  path: string
  /** 截取该元素；与 clip 都省略时截取整个视口 */
  selector?: string
  /** 截取视口内的矩形区域，在 setup 之后计算 */
  clip?: (page: Page) => Promise<{ x: number, y: number, width: number, height: number }>
  /** 元素截图向外扩展的留白，单位 px */
  padding?: number
  viewport?: { width: number, height: number }
  setup?: (page: Page) => Promise<void>
  /** 需要构建与运行时都配置 AI_API_KEY */
  requiresAi?: boolean
  /** 自行生成文件，跳过截图 */
  capture?: (page: Page, file: string) => Promise<void>
}

const DOC = '/docs/guide/configuration'
const POPOVER = '[data-reka-popper-content-wrapper]'

const click = (selector: string) => async (page: Page) => {
  await page.locator(selector).first().click()
  await page.waitForTimeout(400)
}

const scrollToBottom = async (page: Page) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
}

// 流式输出结束的近似判断：页面文本连续数秒不再变化
async function waitForStableText(page: Page, timeout = 120_000): Promise<void> {
  const start = Date.now()
  let last = ''
  let stableSince = Date.now()
  while (Date.now() - start < timeout) {
    await page.waitForTimeout(1000)
    const text = await page.evaluate(() => document.body.textContent ?? '')
    if (text !== last) {
      last = text
      stableSince = Date.now()
    } else if (Date.now() - stableSince > 4000) {
      return
    }
  }
}

const topOf = (height: number) => async (page: Page) => ({ x: 0, y: 0, width: page.viewportSize()!.width, height })
const bottomOf = (height: number) => async (page: Page) => {
  const { width, height: viewport } = page.viewportSize()!
  return { x: 0, y: viewport - height, width, height }
}

export const SHOTS: Shot[] = [
  { name: 'theme-overview', path: '/docs/guide/theme' },
  { name: 'theme-picker', path: DOC, setup: click('button[aria-label="主题设置"]'), selector: POPOVER },
  { name: 'navigation-overview', path: '/docs/guide/navigation', clip: topOf(600) },
  {
    name: 'search-recent',
    path: '/docs/getting-started',
    setup: async (page) => {
      for (const path of ['/docs/guide/theme', '/docs/ai/ai-chat', '/docs/writing/code-blocks', DOC]) {
        await page.goto(path, { waitUntil: 'networkidle' })
      }
      await page.keyboard.press('ControlOrMeta+K')
      await page.waitForTimeout(600)
    },
    selector: '[role="dialog"]'
  },
  { name: 'releases-page', path: '/releases' },
  { name: 'templates-page', path: '/templates' },
  {
    name: 'og-image',
    path: DOC,
    // 浏览器中读取不到 og:image，改从预渲染产物中读取地址并复制生成的图片
    capture: async (_page, file) => {
      const { copyFileSync, readFileSync } = await import('node:fs')
      const output = new URL('../../docs/.output/public', import.meta.url).pathname
      const html = readFileSync(`${output}${DOC}.html`, 'utf8')
      const url = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1]
      if (!url) throw new Error('og:image meta not found in prerendered HTML')
      copyFileSync(`${output}${new URL(url).pathname}`, file)
    }
  },

  { name: 'component-Header', path: DOC, selector: 'header[data-slot="root"]' },
  { name: 'component-HeaderLogo', path: DOC, selector: 'header a[aria-label="Movk Nuxt Docs"]', padding: 16 },
  { name: 'component-HeaderCenter', path: DOC, selector: 'nav[aria-label="主导航"]', padding: 16 },
  { name: 'component-HeaderCTA', path: DOC, selector: 'button[aria-label="与 AI 聊天"]', padding: 16, requiresAi: true },
  {
    name: 'component-HeaderBody',
    path: DOC,
    viewport: { width: 390, height: 844 },
    // 菜单开关是页头最后一个可见按钮，没有可用的 aria-label
    setup: async (page) => {
      await page.locator('header button:visible').last().click()
      await page.waitForTimeout(600)
    }
  },
  {
    name: 'component-HeaderBottom',
    path: DOC,
    setup: async page => page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.3)),
    selector: 'nav[aria-label="分类导航"]'
  },
  { name: 'component-LanguageSwitcher', path: DOC, setup: click('header button:has-text("🇨🇳")'), selector: POPOVER },
  { name: 'component-ThemePicker', path: DOC, setup: click('button[aria-label="主题设置"]'), selector: POPOVER },
  {
    name: 'component-PageHeaderLinks',
    path: DOC,
    setup: click('main button[aria-label="更多操作"]'),
    clip: topOf(520)
  },
  { name: 'component-DocsAsideLeftTop', path: DOC, clip: async page => ({ ...(await page.locator('aside[data-slot="left"]').boundingBox())!, height: 140 }) },
  { name: 'component-DocsAsideLeftBody', path: DOC, selector: 'aside[data-slot="left"]' },
  { name: 'component-DocsAsideRightBottom', path: DOC, selector: 'div[data-slot="bottom"]', padding: 12, requiresAi: true },
  { name: 'component-Footer', path: DOC, setup: scrollToBottom, selector: 'footer[data-slot="root"]' },
  { name: 'component-FooterLeft', path: DOC, setup: scrollToBottom, selector: 'footer [data-slot="left"]', padding: 12 },
  { name: 'component-FooterRight', path: DOC, setup: scrollToBottom, selector: 'footer [data-slot="right"]', padding: 12 },

  {
    name: 'ai-chat',
    path: '/docs/getting-started',
    requiresAi: true,
    setup: async (page) => {
      await click('button[aria-label="与 AI 聊天"]')(page)
      const prompt = page.locator('textarea').last()
      await prompt.fill('如何启用多语言？')
      await prompt.press('Enter')
      await waitForStableText(page)
    }
  },
  { name: 'ai-chat-floating-input', path: '/docs/getting-started', requiresAi: true, clip: bottomOf(220) }
]
