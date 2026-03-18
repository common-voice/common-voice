jest.mock('../config', () => ({
  getTmpDir: () => tmpDir,
}))

jest.mock('./logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
  },
}))

import * as fs from 'node:fs'
import * as fsp from 'node:fs/promises'
import * as path from 'node:path'
import * as os from 'node:os'

import { cleanCacheDir } from './cleanCacheDir'
import { logger } from './logger'

let tmpDir: string

beforeEach(async () => {
  jest.clearAllMocks()
  tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'bundler-cache-'))
})

afterEach(async () => {
  await fsp.rm(tmpDir, { recursive: true, force: true })
})

describe('cleanCacheDir', () => {
  it('removes all entries from the cache directory', async () => {
    await fsp.mkdir(path.join(tmpDir, 'cv-corpus-24.0-2025-12-05', 'en', 'clips'), { recursive: true })
    await fsp.writeFile(path.join(tmpDir, 'cv-corpus-24.0-2025-12-05', 'en', 'clips', 'c1.mp3'), 'audio')
    await fsp.writeFile(path.join(tmpDir, 'en_clips.tsv'), 'data')
    await fsp.mkdir(path.join(tmpDir, 'cv-corpus-24.0-delta-2025-12-05', 'en'), { recursive: true })

    cleanCacheDir()

    const remaining = fs.readdirSync(tmpDir)
    expect(remaining).toEqual([])
    expect(logger.info).toHaveBeenCalledWith(
      'WORKER',
      expect.stringContaining('removed 3 item(s)'),
    )
  })

  it('does nothing when cache directory is empty', () => {
    cleanCacheDir()

    expect(logger.info).not.toHaveBeenCalledWith(
      'WORKER',
      expect.stringContaining('removed'),
    )
  })

  it('does nothing when cache directory does not exist', async () => {
    await fsp.rm(tmpDir, { recursive: true, force: true })

    expect(() => cleanCacheDir()).not.toThrow()
  })

  it('continues removing other entries when one is unremovable', async () => {
    // Create a directory whose contents cannot be removed by making the
    // parent directory read-only. rmSync will throw EACCES on that entry
    // while the other entries should still be cleaned up.
    const removableFile = path.join(tmpDir, 'aaa_removable.txt')
    const lockedDir = path.join(tmpDir, 'bbb_locked')
    const anotherFile = path.join(tmpDir, 'ccc_also_removable.txt')

    await fsp.writeFile(removableFile, 'a')
    await fsp.mkdir(lockedDir)
    await fsp.writeFile(path.join(lockedDir, 'child.txt'), 'x')
    // Make the directory read-only so rmSync cannot remove it
    await fsp.chmod(lockedDir, 0o444)
    await fsp.writeFile(anotherFile, 'c')

    cleanCacheDir()

    const remaining = fs.readdirSync(tmpDir)
    // Only the locked dir should remain
    expect(remaining).toEqual(['bbb_locked'])
    expect(logger.warn).toHaveBeenCalledWith(
      'WORKER',
      expect.stringContaining('failed to remove bbb_locked'),
    )
    // freedCount = 2 (the two removable entries)
    expect(logger.info).toHaveBeenCalledWith(
      'WORKER',
      expect.stringContaining('removed 2 item(s)'),
    )

    // Restore permissions so afterEach can clean up
    await fsp.chmod(lockedDir, 0o755)
  })
})
