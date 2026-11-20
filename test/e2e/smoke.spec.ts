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
  for (const path of ['/llms.txt', '/llms-full.txt', '/sitemap.xml']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
  }
})

test('双语站点地图收录各自的文档版本', async ({ request }) => {
  const index = await request.get('/sitemap_index.xml')
  expect(index.ok()).toBe(true)
  const xml = await index.text()

  for (const [locale, prefix] of [['zh-CN', ''], ['en', '/en']]) {
    const path = `/__sitemap__/${locale}.xml`
    expect(xml).toContain(path)
    const response = await request.get(path)
    expect(response.ok()).toBe(true)
    expect(await response.text()).toContain(`https://docs.mhaibaraai.cn${prefix}/docs/getting-started</loc>`)
  }
})

test('robots.txt 允许抓取前端资源并限制 GitHub API', async ({ request }) => {
  const response = await request.get('/robots.txt')
  expect(response.status()).toBe(200)
  const robots = await response.text()
  expect(robots).not.toMatch(/^Disallow:\s*\/(?:_nuxt(?:\/|$)|api\/?\s*$)/m)
  expect(robots).toMatch(/^Disallow:\s*\/api\/github\/$/m)
})

test('组件示例接口', async ({ request }) => {
  const response = await request.get('/api/component-example/accordion-example.json')
  expect(response.status()).toBe(200)
  expect(await response.json()).toHaveProperty('code')
})

test('文档 SEO 元数据、OG 图片与站点信息可用', async ({ page, request }) => {
  const pageResponse = await page.goto('/docs/getting-started')
  expect(pageResponse?.ok()).toBe(true)

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/docs\/getting-started$/)
  const structuredData = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent() || '{}')
  expect(structuredData['@context']).toBe('https://schema.org')
  expect(structuredData['@graph']).toEqual(expect.arrayContaining([
    expect.objectContaining({ '@type': expect.arrayContaining(['TechArticle']), 'headline': '简介' })
  ]))

  // OG 处于 zeroRuntime 模式，元数据来自预渲染 HTML。
  const prerendered = await request.get('/docs/getting-started.html')
  expect(prerendered.ok()).toBe(true)
  const preview = await page.evaluate((html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return {
      image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      alt: doc.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')
    }
  }, await prerendered.text())
  expect(preview.image).toBeTruthy()
  expect(preview.alt).toBe('简介')
  const imageUrl = new URL(preview.image!, page.url())
  const response = await request.get(imageUrl.pathname + imageUrl.search)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^image\//)
  expect((await response.body()).byteLength).toBeGreaterThan(0)

  const card = await request.get('/.well-known/mcp/server-card.json')
  expect(card.status()).toBe(200)
  expect((await card.json()).serverInfo.name).toBe('Movk Nuxt Docs')
})

test('中英文页面输出各自的分享标签和 canonical', async ({ page, request }) => {
  const docsPath = '/docs/getting-started'
  const pages = [
    { path: '/', ogTitle: 'Modern Nuxt Documentation Theme' },
    { path: '/en', ogTitle: 'Modern Nuxt Documentation Theme' },
    { path: docsPath, ogTitle: '简介' },
    { path: `/en${docsPath}`, ogTitle: 'Introduction' },
    { path: '/templates', ogTitle: '案例展示' },
    { path: '/en/templates', ogTitle: 'Showcase' },
    { path: '/releases', ogTitle: '版本发布' },
    { path: '/en/releases', ogTitle: 'Releases' }
  ]

  for (const { path, ogTitle } of pages) {
    const response = await request.get(`${path}?utm_source=test`, { headers: { 'Accept-Language': 'zh-CN' } })
    expect(response.ok(), path).toBe(true)
    const head = await page.evaluate((html) => {
      const document = new DOMParser().parseFromString(html, 'text/html')
      const metadata = (property: string) => document.querySelector(`meta[property="${property}"]`)?.getAttribute('content')
      return {
        title: metadata('og:title'),
        description: metadata('og:description'),
        type: metadata('og:type'),
        url: metadata('og:url'),
        canonicals: [...document.querySelectorAll<HTMLLinkElement>('link[rel=canonical]')].map(link => link.href),
        alternates: Object.fromEntries([...document.querySelectorAll<HTMLLinkElement>('link[hreflang]')].map(link => [link.hreflang, link.href])),
        markdown: document.querySelector<HTMLLinkElement>('link[rel=alternate][type="text/markdown"]')?.href
      }
    }, await response.text())

    const isDoc = path.endsWith(docsPath)
    expect(head.title, path).toContain(ogTitle)
    expect(head.description, path).toBeTruthy()
    expect(head.type, path).toBe(isDoc ? 'article' : 'website')
    expect(head.canonicals, path).toEqual([head.url])
    expect(new URL(head.url!).pathname, path).toBe(path)
    expect(new URL(head.url!).search, path).toBe('')

    if (isDoc) {
      expect(new URL(head.markdown!).pathname).toBe(`${path}.md`)
      expect(head.alternates['x-default']).toBe(head.alternates['zh-CN'])
      expect(new URL(head.alternates.en!).pathname).toBe(`/en${docsPath}`)
      expect(new URL(head.alternates['zh-CN']!).pathname).toBe(docsPath)
    }
    if (path === docsPath) expect(head.description).toContain('集成排版、导航、搜索、SEO 和 AI')
    if (path === '/' || path === '/en') expect(head.description).toContain('Build modern Nuxt 4 documentation sites')
  }
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

test('主题设置切换图标与颜色模式偏好', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/docs/getting-started')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: '主题设置', exact: true }).click()

  const modes = page.getByRole('group', { name: '颜色模式' })
  await modes.getByRole('button', { name: 'light', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/light/)
  await expect(modes.getByRole('button', { name: 'light', exact: true })).toHaveClass(/(^|\s)bg-elevated(\s|$)/)

  await modes.getByRole('button', { name: 'system', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(modes.getByRole('button', { name: 'system', exact: true })).toHaveClass(/(^|\s)bg-elevated(\s|$)/)

  const icons = page.getByRole('group', { name: '图标', exact: true })
  await icons.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Tabler', exact: true }).click()
  await expect(icons.getByRole('combobox')).toContainText('Tabler')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('movk-nuxt-docs-ui-icons'))).toBe('tabler')

  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: '主题设置', exact: true }).click()
  await expect(icons.getByRole('combobox')).toContainText('Tabler')
  await expect(modes.getByRole('button', { name: 'system', exact: true })).toHaveClass(/(^|\s)bg-elevated(\s|$)/)
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

test('A–Z 索引列出全部文档页且链接可达', async ({ page }) => {
  await page.goto('/docs/reference/a-z')
  const index = page.locator('#index-M')
  await expect(index.getByRole('link', { name: /Migrating from v2/ })).toHaveAttribute('href', '/docs/getting-started/migration')
  await page.goto('/en/docs/reference/a-z')
  await expect(page.locator('#index-A').getByRole('link', { name: /AI Chat/ })).toHaveAttribute('href', '/en/docs/ai/ai-chat')
})
