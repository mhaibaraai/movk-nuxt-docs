import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = resolve(__dirname, '..')

const sourceReadme = resolve(rootDir, 'README.md')
const targetReadme = resolve(rootDir, 'layer', 'README.md')

try {
  copyFileSync(sourceReadme, targetReadme)
  console.log('copying README to layer/ directory...')
} catch (error) {
  console.error('Error copying README:', error.message)
  process.exit(1)
}
