import { expect, test } from '@playwright/test'

for (const [page, raw] of [
  ['/', '/raw/index.md'],
  ['/docs/getting-started', '/raw/docs/getting-started.md'],
  ['/en/docs/getting-started', '/raw/en/docs/getting-started.md']
] as const) {
  test(`页面直接返回 HTML，独立 URL 返回 Markdown ${page}`, async ({ request }) => {
    const options = { headers: { accept: 'text/markdown' }, maxRedirects: 0 }
    const html = await request.get(page, options)
    expect(html.status()).toBe(200)
    expect(html.headers()['content-type']).toContain('text/html')
    expect(await html.text()).toContain('property="og:image"')

    const markdown = await request.get(raw, options)
    expect(markdown.status()).toBe(200)
    expect(markdown.headers()['content-type']).toContain('text/markdown')
  })
}

test('旧的中英文文档 URL 保留永久重定向', async ({ request }) => {
  for (const prefix of ['', '/en']) {
    const response = await request.get(`${prefix}/docs/getting-started/deployment`, { maxRedirects: 0 })
    expect(response.status()).toBe(301)
    expect(response.headers().location).toBe(`${prefix}/docs/guide/deployment`)
  }
  const missing = await request.get('/docs/page-that-does-not-exist')
  expect(missing.status()).toBe(404)
})

test('官方站的亮暗色图片和 README 封面可访问', async ({ request }) => {
  for (const path of ['/screenshots/ai-chat-light.png', '/screenshots/ai-chat-dark.png', '/og-image.png']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect(response.headers()['content-type']).toContain('image/png')
  }
})

test('MCP 客户端可以初始化并列出工具', async ({ request }) => {
  for (const [method, params, expected] of [
    ['initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'deployment-test', version: '1.0.0' } }, 'serverInfo'],
    ['tools/list', {}, 'tools']
  ] as const) {
    const response = await request.post('/mcp', {
      headers: { accept: 'application/json, text/event-stream' },
      data: { jsonrpc: '2.0', id: 1, method, params }
    })
    expect(response.status(), method).toBe(200)
    const body = await response.text()
    const message = response.headers()['content-type']?.includes('text/event-stream')
      ? body.split('\n').find(line => line.startsWith('data: '))?.slice(6)
      : body
    expect(JSON.parse(message || '{}').result, method).toHaveProperty(expected)
  }
})

test('Worker 按构建清单路径设置缓存期限', async ({ request }) => {
  const response = await request.get('/_nuxt/builds/latest.json')
  expect(response.status()).toBe(200)
  expect(response.headers()['cache-control']).toBe('public, max-age=1, immutable')

  const { id } = await response.json()
  const metadata = await request.get(`/_nuxt/builds/meta/${id}.json`)
  expect(metadata.status()).toBe(200)
  expect(metadata.headers()['cache-control']).toBe('public, max-age=31536000, immutable')
})
