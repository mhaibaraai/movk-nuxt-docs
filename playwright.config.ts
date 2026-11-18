import { defineConfig, devices } from '@playwright/test'

const PORT = 3301
const cloudflare = process.env.E2E_RUNTIME === 'cloudflare'

export default defineConfig({
  testDir: 'test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: cloudflare
      ? `pnpm --dir docs exec wrangler dev --config .output-cloudflare/server/wrangler.json --local --port ${PORT}`
      : `PORT=${PORT} node docs/.output/server/index.mjs`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !cloudflare && !process.env.CI
  }
})
