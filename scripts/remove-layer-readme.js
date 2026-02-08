import { existsSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = resolve(__dirname, '..')

const targetReadme = resolve(rootDir, 'layer', 'README.md')

try {
  if (existsSync(targetReadme)) {
    unlinkSync(targetReadme)
    console.log('deleting layer/README.md...')
  } else {
    console.log(' layer/README.md does not exist, skipping deletion.')
  }
} catch (error) {
  console.error('Error deleting layer/README.md:', error.message)
  process.exit(1)
}
