import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { either as E } from 'fp-ts'

jest.mock('../infrastructure/redis')
jest.mock('../infrastructure/queue')
jest.mock('../infrastructure/storage')
jest.mock('../infrastructure/database')

import { pruneOrphanClips } from './clips'

describe('pruneOrphanClips', () => {
  let tmpDir: string
  let clipsDirPath: string
  let tsvPath: string

  const LOCALE = 'en'

  /** Write a DB query TSV with a header + rows for the given clip IDs. */
  const writeTsv = (clipIds: string[]) => {
    const header = 'id\tclient_id\tpath\tsentence_id\tsentence\n'
    const rows = clipIds.map(id => `${id}\tclient1\t${id}.mp3\t1\thello\n`)
    fs.writeFileSync(tsvPath, header + rows.join(''))
  }

  /** Create empty clip files on disk. */
  const createClips = (clipIds: string[]) => {
    for (const id of clipIds) {
      fs.writeFileSync(
        path.join(clipsDirPath, `common_voice_${LOCALE}_${id}.mp3`),
        'audio',
      )
    }
  }

  /** List clip filenames currently on disk. */
  const listClips = (): string[] =>
    fs.existsSync(clipsDirPath)
      ? fs.readdirSync(clipsDirPath).sort()
      : []

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prune-test-'))
    clipsDirPath = path.join(tmpDir, 'clips')
    fs.mkdirSync(clipsDirPath, { recursive: true })
    tsvPath = path.join(tmpDir, 'en_clips.tsv')
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('returns 0 when clips dir does not exist', async () => {
    fs.rmSync(clipsDirPath, { recursive: true, force: true })
    writeTsv(['123'])

    const result = await pruneOrphanClips(tsvPath, LOCALE, clipsDirPath)()

    expect(E.isRight(result)).toBe(true)
    expect((result as E.Right<number>).right).toBe(0)
  })

  it('returns 0 when all clips on disk are in the DB', async () => {
    createClips(['100', '200', '300'])
    writeTsv(['100', '200', '300'])

    const result = await pruneOrphanClips(tsvPath, LOCALE, clipsDirPath)()

    expect(E.isRight(result)).toBe(true)
    expect((result as E.Right<number>).right).toBe(0)
    expect(listClips()).toHaveLength(3)
  })

  it('deletes orphan clips not in the DB and returns count', async () => {
    createClips(['100', '200', '300', '400'])
    writeTsv(['100', '300']) // 200 and 400 are orphans (e.g. GDPR-deleted)

    const result = await pruneOrphanClips(tsvPath, LOCALE, clipsDirPath)()

    expect(E.isRight(result)).toBe(true)
    expect((result as E.Right<number>).right).toBe(2)
    expect(listClips()).toEqual([
      'common_voice_en_100.mp3',
      'common_voice_en_300.mp3',
    ])
  })

  it('deletes all clips when DB TSV has no data rows', async () => {
    createClips(['100', '200'])
    // Header only, no data rows
    fs.writeFileSync(tsvPath, 'id\tclient_id\n')

    const result = await pruneOrphanClips(tsvPath, LOCALE, clipsDirPath)()

    expect(E.isRight(result)).toBe(true)
    expect((result as E.Right<number>).right).toBe(2)
    expect(listClips()).toEqual([])
  })

  it('returns 0 when clips dir is empty', async () => {
    writeTsv(['100', '200'])

    const result = await pruneOrphanClips(tsvPath, LOCALE, clipsDirPath)()

    expect(E.isRight(result)).toBe(true)
    expect((result as E.Right<number>).right).toBe(0)
  })

  it('handles large clip IDs (UUIDs)', async () => {
    const ids = [
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      'ffffffff-1111-2222-3333-444444444444',
      'orphan-id-that-should-be-deleted',
    ]
    createClips(ids)
    writeTsv(ids.slice(0, 2)) // third is orphan

    const result = await pruneOrphanClips(tsvPath, LOCALE, clipsDirPath)()

    expect(E.isRight(result)).toBe(true)
    expect((result as E.Right<number>).right).toBe(1)
    expect(listClips()).toHaveLength(2)
    expect(
      listClips().some(f => f.includes('orphan-id')),
    ).toBe(false)
  })
})
