import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import type { Browser } from '@playwright/test'
import { settle } from './settle.ts'

interface Site {
  /** 与 templates.vue 中 slug(item.title) 的结果一致 */
  slug: string
  url: string
}

const SITES: Site[] = [
  { slug: 'mhaibaraai-cn', url: 'https://mhaibaraai.cn' },
  { slug: 'movk-core', url: 'https://core.mhaibaraai.cn' },
  { slug: 'movk-nuxt', url: 'https://nuxt.mhaibaraai.cn' },
  { slug: 'movk-maplibre', url: 'https://maplibre.mhaibaraai.cn' },
  { slug: 'movk-sigma', url: 'https://sigma.mhaibaraai.cn' },
  { slug: 'movk-nuxt-docs', url: 'https://docs.mhaibaraai.cn' }
]

const TEMPLATES_DIR = fileURLToPath(new URL('../../docs/public/assets/templates/', import.meta.url))
const OG_DIR = fileURLToPath(new URL('../../docs/.output/og/', import.meta.url))

interface Frame {
  viewport: { width: number, height: number }
  scale: number
}

// 案例图与 OG 图共用社交卡片比例（1.905:1）。容器宽度上限为 90rem，1520 宽度下排版与 1440 一致，
// 798 的高度能容纳各站点 Hero 的完整首屏；两者只在输出分辨率上不同
const VIEWPORT = { width: 1520, height: 798 }
const TEMPLATE_FRAME: Frame = { viewport: VIEWPORT, scale: 2880 / VIEWPORT.width }
const OG_FRAME: Frame = { viewport: VIEWPORT, scale: 2400 / VIEWPORT.width }

// motion-v 的入场动画由 JS 驱动，settle 无法禁用，等待其结束
const ENTRANCE_DELAY = 1500

// 第三方 iframe（评论、统计工具条）加载时机不稳定，统一隐藏
const HIDE_THIRD_PARTY = 'iframe, vercel-live-feedback { visibility: hidden !important; }'

async function capture(browser: Browser, url: string, frame: Frame, colorScheme: 'light' | 'dark', path: string): Promise<void> {
  // 站点默认语言为中文，避免按浏览器语言跳转到英文版
  const context = await browser.newContext({ colorScheme, viewport: frame.viewport, locale: 'zh-CN', deviceScaleFactor: frame.scale })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await settle(page)
  await page.waitForTimeout(ENTRANCE_DELAY)
  await page.addStyleTag({ content: HIDE_THIRD_PARTY })
  await page.screenshot({ path })
  console.log(`Saved ${path}`)
  await context.close()
}

async function main(): Promise<void> {
  // 参数为 slug 或 slug=url；后者用于截取尚未部署到生产的版本（如本地预览）
  const args = new Map(process.argv.slice(2).map(arg => arg.split('=', 2) as [string, string?]))
  const sites = SITES
    .filter(site => !args.size || args.has(site.slug))
    .map(site => ({ ...site, url: args.get(site.slug) ?? site.url }))

  mkdirSync(TEMPLATES_DIR, { recursive: true })
  mkdirSync(OG_DIR, { recursive: true })
  const browser = await chromium.launch()

  try {
    for (const site of sites) {
      // 本站不在案例页中，只生成 README 使用的 OG 图
      if (site.slug !== 'movk-nuxt-docs') {
        for (const colorScheme of ['light', 'dark'] as const) {
          await capture(browser, site.url, TEMPLATE_FRAME, colorScheme, `${TEMPLATES_DIR}${site.slug}-${colorScheme}.png`)
        }
      }
      await capture(browser, site.url, OG_FRAME, 'light', `${OG_DIR}${site.slug}.png`)
    }
  } finally {
    await browser.close()
  }
}

await main()
