import type { Page } from '@playwright/test'

// 去掉动画与光标闪烁，保证两次生成的截图一致
export async function settle(page: Page): Promise<void> {
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; }' })
  await page.evaluate(() => document.fonts.ready)
}
