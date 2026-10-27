import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { settle } from './settle.ts'
import { SHOTS } from './shots.ts'

const PORT = 3302
const BASE_URL = `http://localhost:${PORT}`
const OUT_DIR = fileURLToPath(new URL('../../docs/public/screenshots/', import.meta.url))
const SERVER = fileURLToPath(new URL('../../docs/.output/server/index.mjs', import.meta.url))
const SCHEMES = ['light', 'dark'] as const
const ENV_FILE = fileURLToPath(new URL('../../docs/.env', import.meta.url))

// 与 pnpm build 读取同一份 docs/.env，AI Chat 在运行时同样需要 AI_API_KEY
if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE)

async function waitForServer(): Promise<void> {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      if ((await fetch(BASE_URL)).ok) return
    } catch {
      // 服务尚未监听端口，稍后重试
    }
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  throw new Error(`Server did not start on ${BASE_URL}, run \`pnpm build\` first`)
}

async function main(): Promise<void> {
  const only = process.argv.slice(2)
  const shots = SHOTS.filter(shot => !only.length || only.includes(shot.name))
  const hasAiKey = Boolean(process.env.AI_API_KEY)

  mkdirSync(OUT_DIR, { recursive: true })
  const server = spawn('node', [SERVER], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' })

  try {
    await waitForServer()
    const browser = await chromium.launch()

    for (const shot of shots) {
      if (shot.requiresAi && !hasAiKey) {
        console.warn(`Skip ${shot.name}: requires AI_API_KEY at build and run time`)
        continue
      }

      for (const colorScheme of SCHEMES) {
        const context = await browser.newContext({
          baseURL: BASE_URL,
          colorScheme,
          viewport: shot.viewport ?? { width: 1440, height: 900 },
          deviceScaleFactor: 2
        })
        const page = await context.newPage()
        await page.goto(shot.path, { waitUntil: 'networkidle' })
        await settle(page)
        await shot.setup?.(page)

        const path = `${OUT_DIR}${shot.name}-${colorScheme}.png`
        if (shot.capture) {
          await shot.capture(page, path)
        } else if (shot.clip) {
          await page.screenshot({ path, clip: await shot.clip(page) })
        } else if (shot.selector) {
          const box = await page.locator(shot.selector).first().boundingBox()
          if (!box) throw new Error(`${shot.name}: ${shot.selector} is not visible`)
          const pad = shot.padding ?? 0
          await page.screenshot({ path, clip: { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + pad * 2, height: box.height + pad * 2 } })
        } else {
          await page.screenshot({ path })
        }
        console.log(`Saved ${path}`)
        await context.close()
      }
    }

    await browser.close()
  } finally {
    server.kill()
  }
}

await main()
