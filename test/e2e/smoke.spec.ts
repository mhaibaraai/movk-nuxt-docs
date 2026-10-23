import { expect, test } from '@playwright/test'

test('首页可访问', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('文档页渲染标题、目录与侧边导航', async ({ page }) => {
  await page.goto('/docs/getting-started')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('nav').filter({ hasText: '安装' }).first()).toBeVisible()
})

test('英文文档页可访问', async ({ page }) => {
  const response = await page.goto('/en/docs/getting-started')
  expect(response?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('未配置 AI Key 时搜索可用', async ({ page }) => {
  await page.goto('/docs/getting-started')
  await page.waitForLoadState('networkidle')
  // Desktop Chrome 预设为 Windows UA，meta_k 映射为 Ctrl+K
  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('textbox').fill('MCP Server')
  await expect(dialog.getByRole('option', { name: /MCP Server/ }).first()).toBeVisible()
})

test('llms.txt 与 sitemap 可访问', async ({ request }) => {
  for (const path of ['/llms.txt', '/llms-full.txt', '/sitemap.xml', '/robots.txt']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
  }
})

test('组件示例接口', async ({ request }) => {
  const response = await request.get('/api/component-example/accordion-example.json')
  expect(response.status()).toBe(200)
  expect(await response.json()).toHaveProperty('code')
})

test('访客主题偏好生效且无水合错误', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  // 外部资源加载失败与本测试无关，只关注运行时异常与水合不匹配
  page.on('console', (message) => {
    if (/hydration/i.test(message.text())) errors.push(message.text())
  })

  await page.goto('/docs/getting-started')
  await page.evaluate(() => localStorage.setItem('movk-nuxt-docs-ui-radius', '0.5'))
  await page.reload()
  await page.waitForLoadState('networkidle')

  const radius = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-radius').trim())
  expect(radius).toBe('0.5rem')
  expect(errors).toEqual([])
})

test('页头导航来自 app.config 并按语言本地化', async ({ page }) => {
  await page.goto('/docs/getting-started')
  const zhNav = page.getByRole('navigation', { name: '主导航' })
  await expect(zhNav.getByRole('link', { name: '文档' })).toHaveAttribute('aria-current', 'page')
  await expect(zhNav.getByRole('link', { name: '案例' })).toHaveAttribute('href', '/templates')

  await page.goto('/en/docs/getting-started')
  const enNav = page.getByRole('navigation', { name: 'Main Navigation' })
  await expect(enNav.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/en/docs/getting-started')
  await expect(enNav.getByRole('link', { name: 'Showcase' })).toHaveAttribute('href', '/en/templates')
})
