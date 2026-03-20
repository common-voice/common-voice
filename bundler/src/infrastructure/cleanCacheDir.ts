import * as fs from 'node:fs'
import * as path from 'node:path'

import { getTmpDir } from '../config'
import { logger } from './logger'

/**
 * Remove all files and directories under the cache/tmp dir to reclaim disk
 * space. Called on --force full init to ensure stale data from pod
 * crashes/terminations (where cleanup cannot run) does not exhaust the PVC.
 *
 * Uses synchronous fs for simplicity -- runs once at init before any locale
 * jobs are dispatched, so blocking the event loop briefly is acceptable.
 */
export const cleanCacheDir = (): void => {
  const tmpDir = getTmpDir()
  if (!fs.existsSync(tmpDir)) return

  const entries = fs.readdirSync(tmpDir)
  let freedCount = 0
  for (const entry of entries) {
    try {
      fs.rmSync(path.join(tmpDir, entry), { recursive: true, force: true })
      freedCount++
    } catch (err) {
      logger.warn('WORKER', `Cache cleanup: failed to remove ${entry}: ${String(err)}`)
    }
  }
  if (freedCount > 0) {
    logger.info('WORKER', `Cache cleanup: removed ${freedCount} item(s) from ${tmpDir} (--force)`)
  }
}
