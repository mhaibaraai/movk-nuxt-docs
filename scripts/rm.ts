import { rm } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import process from 'node:process'
import fg from 'fast-glob'

interface CleanupStats {
  totalRemoved: number
  totalAttempted: number
  failedRemovals: string[]
  totalSize: number
}

interface RemovalResult {
  path: string
  success: boolean
  error?: string
}

const args = process.argv.slice(2)
const TARGETS_TO_REMOVE = args.length > 0
  ? args
  : ['node_modules', '.nuxt', '.data', '.output', '.cache', 'dist', 'dist.zip']
const ROOT_DIR = resolve(process.cwd())

// 批处理大小，避免同时打开过多文件句柄
const BATCH_SIZE = 10

async function removePath(targetPath: string): Promise<RemovalResult> {
  try {
    await rm(targetPath, { recursive: true, force: true, maxRetries: 3 })
    return { path: targetPath, success: true }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { path: targetPath, success: true }
    }
    return {
      path: targetPath,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

async function processBatch(paths: string[]): Promise<RemovalResult[]> {
  const results: RemovalResult[] = []

  for (let i = 0; i < paths.length; i += BATCH_SIZE) {
    const batch = paths.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(batch.map(removePath))
    results.push(...batchResults)
  }

  return results
}

async function cleanProject(): Promise<void> {
  const startTime = Date.now()

  const globPatterns = TARGETS_TO_REMOVE.map(target => `**/${target}`)

  let pathsToRemove: string[]
  try {
    pathsToRemove = await fg(globPatterns, {
      cwd: ROOT_DIR,
      onlyFiles: false,
      dot: true,
      absolute: true,
      ignore: ['**/node_modules/**/node_modules/**'],
      suppressErrors: true
    })
  } catch (error) {
    console.error('Error searching for files:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }

  if (pathsToRemove.length === 0) {
    console.log('No targets found to remove.')
    return
  }

  pathsToRemove = [...new Set(pathsToRemove)].sort((a, b) => b.length - a.length)

  const results = await processBatch(pathsToRemove)

  const stats: CleanupStats = {
    totalRemoved: 0,
    totalAttempted: results.length,
    failedRemovals: [],
    totalSize: 0
  }

  results.forEach((result) => {
    if (result.success) {
      stats.totalRemoved++
    } else {
      stats.failedRemovals.push(`${relative(ROOT_DIR, result.path)}: ${result.error}`)
    }
  })

  const duration = (Date.now() - startTime) / 1000

  console.log(`Removed ${stats.totalRemoved}/${stats.totalAttempted} items in ${duration.toFixed(2)}s`)

  if (stats.failedRemovals.length > 0) {
    console.warn(`\n${stats.failedRemovals.length} items failed to remove:`)
    stats.failedRemovals.forEach((failure) => {
      console.warn(`  ${failure}`)
    })
    process.exit(1)
  }
}

process.on('SIGINT', () => {
  console.log('\nCleanup interrupted')
  process.exit(130)
})

cleanProject().catch((error) => {
  console.error('Cleanup failed:', error instanceof Error ? error.message : String(error))
  process.exit(1)
})
