jest.mock('../config', () => ({
  getEnvironment: () => 'production',
  getTmpDir: () => tmpDir,
}))

jest.mock('./compress', () => ({
  generateTarFilename: (locale: string, releaseName: string, license?: string) =>
    license
      ? `${releaseName}-${locale}-${license}.tar.gz`
      : `${releaseName}-${locale}.tar.gz`,
}))

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as os from 'node:os'

import { either as E } from 'fp-ts'

import { cleanUp } from './cleanUp'

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bundler-cleanup-'))
})

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true })
})

describe('cleanUp', () => {
  const locale = 'en'
  const releaseName = 'cv-corpus-25.0-2026-03-09'
  const prevReleaseName = 'cv-corpus-24.0-2025-12-05'
  const deltaReleaseName = 'cv-corpus-25.0-delta-2026-03-09'

  it('removes locale working directory', async () => {
    const releaseDirPath = path.join(tmpDir, releaseName)
    const localeDir = path.join(releaseDirPath, locale)
    await fs.mkdir(path.join(localeDir, 'clips'), { recursive: true })
    await fs.writeFile(path.join(localeDir, 'clips', 'clip1.mp3'), 'audio')
    await fs.writeFile(path.join(localeDir, 'validated.tsv'), 'data')

    const result = await cleanUp(locale, releaseDirPath, '')()
    expect(E.isRight(result)).toBe(true)

    const exists = await fs.access(localeDir).then(() => true).catch(() => false)
    expect(exists).toBe(false)
  })

  it('removes output tarball when provided', async () => {
    const releaseDirPath = path.join(tmpDir, releaseName)
    await fs.mkdir(releaseDirPath, { recursive: true })
    const tarPath = path.join(releaseDirPath, 'tarballs', `${releaseName}-${locale}.tar.gz`)
    await fs.mkdir(path.dirname(tarPath), { recursive: true })
    await fs.writeFile(tarPath, 'tarball')

    const result = await cleanUp(locale, releaseDirPath, tarPath)()
    expect(E.isRight(result)).toBe(true)

    const exists = await fs.access(tarPath).then(() => true).catch(() => false)
    expect(exists).toBe(false)
  })

  it('removes clips metadata TSV', async () => {
    const releaseDirPath = path.join(tmpDir, releaseName)
    await fs.mkdir(releaseDirPath, { recursive: true })
    const tsvPath = path.join(tmpDir, `${locale}_clips.tsv`)
    await fs.writeFile(tsvPath, 'clip\tdata')

    const result = await cleanUp(locale, releaseDirPath, '')()
    expect(E.isRight(result)).toBe(true)

    const exists = await fs.access(tsvPath).then(() => true).catch(() => false)
    expect(exists).toBe(false)
  })

  it('removes previous release locale subtree and tarball', async () => {
    const releaseDirPath = path.join(tmpDir, releaseName)
    await fs.mkdir(releaseDirPath, { recursive: true })

    const prevLocaleDir = path.join(tmpDir, prevReleaseName, locale)
    await fs.mkdir(path.join(prevLocaleDir, 'clips'), { recursive: true })
    await fs.writeFile(path.join(prevLocaleDir, 'clips', 'old.mp3'), 'audio')
    const prevTar = path.join(tmpDir, `${prevReleaseName}-${locale}.tar.gz`)
    await fs.writeFile(prevTar, 'tarball')

    const result = await cleanUp(locale, releaseDirPath, '', prevReleaseName, undefined)()
    expect(E.isRight(result)).toBe(true)

    const dirExists = await fs.access(prevLocaleDir).then(() => true).catch(() => false)
    const tarExists = await fs.access(prevTar).then(() => true).catch(() => false)
    expect(dirExists).toBe(false)
    expect(tarExists).toBe(false)
  })

  it('removes delta release locale subtree and tarball', async () => {
    const releaseDirPath = path.join(tmpDir, releaseName)
    await fs.mkdir(releaseDirPath, { recursive: true })

    const deltaLocaleDir = path.join(tmpDir, deltaReleaseName, locale)
    await fs.mkdir(path.join(deltaLocaleDir, 'clips'), { recursive: true })
    await fs.writeFile(path.join(deltaLocaleDir, 'clips', 'new.mp3'), 'audio')
    const deltaTar = path.join(tmpDir, `${deltaReleaseName}-${locale}.tar.gz`)
    await fs.writeFile(deltaTar, 'tarball')

    const result = await cleanUp(locale, releaseDirPath, '', undefined, deltaReleaseName)()
    expect(E.isRight(result)).toBe(true)

    const dirExists = await fs.access(deltaLocaleDir).then(() => true).catch(() => false)
    const tarExists = await fs.access(deltaTar).then(() => true).catch(() => false)
    expect(dirExists).toBe(false)
    expect(tarExists).toBe(false)
  })

  it('succeeds even when files do not exist (force: true)', async () => {
    const releaseDirPath = path.join(tmpDir, releaseName)

    const result = await cleanUp(
      locale, releaseDirPath, '', prevReleaseName, deltaReleaseName,
    )()
    expect(E.isRight(result)).toBe(true)
  })

  it('skips tarball removal when tarFilepath is empty string', async () => {
    const releaseDirPath = path.join(tmpDir, releaseName)
    await fs.mkdir(releaseDirPath, { recursive: true })

    const result = await cleanUp(locale, releaseDirPath, '')()
    expect(E.isRight(result)).toBe(true)
  })
})
