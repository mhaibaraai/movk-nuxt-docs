import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const generatedConfig = 'docs/.output-cloudflare/server/wrangler.json'
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID
const localD1Id = '00000000-0000-0000-0000-000000000000'

if (!databaseId || databaseId === localD1Id) {
  console.error('Set CLOUDFLARE_D1_DATABASE_ID to the production D1 database ID before deploying.')
  process.exit(1)
}

const config = JSON.parse(readFileSync(generatedConfig, 'utf8'))
if (config.d1_databases?.find(database => database.binding === 'DB')?.database_id !== databaseId) {
  console.error('Run pnpm build:cloudflare with the same CLOUDFLARE_D1_DATABASE_ID before deploying.')
  process.exit(1)
}

const result = spawnSync('pnpm', ['--dir', 'docs', 'exec', 'wrangler', 'deploy', '--config', '.output-cloudflare/server/wrangler.json'], { stdio: 'inherit' })
if (result.error) throw result.error
process.exit(result.status ?? 1)
