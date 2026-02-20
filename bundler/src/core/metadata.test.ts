import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { generateMetadataTarFilename, getMetadataFiles } from './metadata'

describe('generateMetadataTarFilename', () => {
  it('generates unlicensed metadata filename', () => {
    expect(generateMetadataTarFilename('en', 'cv-19.0')).toBe(
      'cv-19.0-en-metadata.tar.gz',
    )
  })

  it('generates licensed metadata filename with sanitized license', () => {
    expect(
      generateMetadataTarFilename('en', 'cv-19.0-licensed', 'CC-BY-SA-4.0'),
    ).toBe('cv-19.0-licensed-en-CC-BY-SA-4.0-metadata.tar.gz')
  })

  it('generates delta licensed metadata filename', () => {
    expect(
      generateMetadataTarFilename('fr', 'cv-19.0-delta-licensed', 'CC0-1.0'),
    ).toBe('cv-19.0-delta-licensed-fr-CC0-1.0-metadata.tar.gz')
  })

  it('sanitizes special characters in license', () => {
    expect(
      generateMetadataTarFilename('en', 'cv-19.0-licensed', 'CC BY/NC'),
    ).toBe('cv-19.0-licensed-en-CC_BY_NC-metadata.tar.gz')
  })
})

describe('getMetadataFiles', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'metadata-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('returns all regular files at locale root', () => {
    const localeDir = path.join(tmpDir, 'en')
    fs.mkdirSync(localeDir)
    fs.writeFileSync(path.join(localeDir, 'clips.tsv'), 'data')
    fs.writeFileSync(path.join(localeDir, 'validated.tsv'), 'data')
    fs.writeFileSync(path.join(localeDir, 'reported.tsv'), 'data')

    const files = getMetadataFiles('en', tmpDir)
    expect(files.sort()).toEqual([
      'en/clips.tsv',
      'en/reported.tsv',
      'en/validated.tsv',
    ])
  })

  it('excludes directories (clips/ subdir)', () => {
    const localeDir = path.join(tmpDir, 'en')
    fs.mkdirSync(localeDir)
    fs.mkdirSync(path.join(localeDir, 'clips'))
    fs.writeFileSync(path.join(localeDir, 'clips', 'audio.mp3'), 'binary')
    fs.writeFileSync(path.join(localeDir, 'validated.tsv'), 'data')

    const files = getMetadataFiles('en', tmpDir)
    expect(files).toEqual(['en/validated.tsv'])
  })

  it('returns empty array for missing locale directory', () => {
    const files = getMetadataFiles('nonexistent', tmpDir)
    expect(files).toEqual([])
  })

  it('returns empty array for empty locale directory', () => {
    const localeDir = path.join(tmpDir, 'en')
    fs.mkdirSync(localeDir)

    const files = getMetadataFiles('en', tmpDir)
    expect(files).toEqual([])
  })

  it('includes all text file types', () => {
    const localeDir = path.join(tmpDir, 'en')
    fs.mkdirSync(localeDir)
    fs.writeFileSync(path.join(localeDir, 'data.tsv'), '')
    fs.writeFileSync(path.join(localeDir, 'data.csv'), '')
    fs.writeFileSync(path.join(localeDir, 'README.md'), '')
    fs.writeFileSync(path.join(localeDir, 'clip_durations.tsv'), '')

    const files = getMetadataFiles('en', tmpDir)
    expect(files.sort()).toEqual([
      'en/README.md',
      'en/clip_durations.tsv',
      'en/data.csv',
      'en/data.tsv',
    ])
  })

  it('typical locale directory matches expected metadata file set', () => {
    const localeDir = path.join(tmpDir, 'test1')
    fs.mkdirSync(localeDir)
    // Simulate actual locale dir after CorporaCreator + sentences
    const files = [
      'clips.tsv',
      'clip_durations.tsv',
      'dev.tsv',
      'test.tsv',
      'train.tsv',
      'validated.tsv',
      'invalidated.tsv',
      'other.tsv',
      'reported.tsv',
      'validated_sentences.tsv',
      'unvalidated_sentences.tsv',
    ]
    files.forEach(f => fs.writeFileSync(path.join(localeDir, f), ''))
    // Also create clips directory with MP3s
    fs.mkdirSync(path.join(localeDir, 'clips'))
    fs.writeFileSync(path.join(localeDir, 'clips', 'audio1.mp3'), '')
    fs.writeFileSync(path.join(localeDir, 'clips', 'audio2.mp3'), '')

    const result = getMetadataFiles('test1', tmpDir)
    // All 11 text files, no clips/ directory
    expect(result).toHaveLength(11)
    expect(result.every(f => f.startsWith('test1/'))).toBe(true)
    expect(result.some(f => f.includes('clips/'))).toBe(false)
    expect(result.some(f => f.endsWith('.mp3'))).toBe(false)
  })
})
