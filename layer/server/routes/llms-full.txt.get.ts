import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const possiblePaths = [
    join(process.cwd(), '.vercel/output/static/llms-full.txt'),
    join(process.cwd(), '.output/public/llms-full.txt'),
    join(process.cwd(), 'public/llms-full.txt')
  ]

  let content: string | null = null
  let lastError: Error | null = null

  for (const filePath of possiblePaths) {
    try {
      content = await readFile(filePath, 'utf-8')
      break
    } catch (err) {
      lastError = err as Error
      continue
    }
  }

  if (!content) {
    throw createError({
      statusCode: 404,
      statusMessage: 'llms-full.txt not found',
      data: { error: lastError?.message }
    })
  }

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return content
})
