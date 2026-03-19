import {
  sanitizeLicenseName,
  generateTarFilename,
  pathsFilter,
  decideCompressionLevel,
  shouldStreamToGCS,
} from './compress'
import { STREAM_COMPRESS_CLIP_THRESHOLD } from '../config'

jest.mock('node:child_process', () => ({
  ...jest.requireActual('node:child_process'),
  execFileSync: jest.fn(),
}))

jest.mock('node:fs', () => ({
  ...jest.requireActual('node:fs'),
  statfsSync: jest.fn(),
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execFileSync: mockExecFileSync } = require('node:child_process') as { execFileSync: jest.Mock }
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { statfsSync: mockStatfsSync } = require('node:fs') as { statfsSync: jest.Mock }

describe('sanitizeLicenseName', () => {
  it('passes through simple names unchanged', () => {
    expect(sanitizeLicenseName('CC0-1.0')).toBe('CC0-1.0')
  })

  it('replaces spaces with underscores', () => {
    expect(sanitizeLicenseName('CC BY SA')).toBe('CC_BY_SA')
  })

  it('replaces slashes with underscores', () => {
    expect(sanitizeLicenseName('CC-BY/NC')).toBe('CC-BY_NC')
  })

  it('replaces backslashes with underscores', () => {
    expect(sanitizeLicenseName('CC\\BY')).toBe('CC_BY')
  })

  it('replaces colons with underscores', () => {
    expect(sanitizeLicenseName('License:V2')).toBe('License_V2')
  })

  it('replaces multiple special characters', () => {
    expect(sanitizeLicenseName('CC BY-SA/4.0:final')).toBe('CC_BY-SA_4.0_final')
  })

  it('handles empty string', () => {
    expect(sanitizeLicenseName('')).toBe('')
  })
})

describe('generateTarFilename', () => {
  it('generates unlicensed filename', () => {
    expect(generateTarFilename('en', 'cv-19.0')).toBe('cv-19.0-en.tar.gz')
  })

  it('generates licensed filename with sanitized license', () => {
    expect(generateTarFilename('en', 'cv-19.0-licensed', 'CC-BY-SA-4.0')).toBe(
      'cv-19.0-licensed-en-CC-BY-SA-4.0.tar.gz',
    )
  })

  it('sanitizes license with special characters in filename', () => {
    expect(generateTarFilename('fr', 'cv-19.0-licensed', 'CC BY/NC')).toBe(
      'cv-19.0-licensed-fr-CC_BY_NC.tar.gz',
    )
  })

  it('generates delta unlicensed filename', () => {
    expect(generateTarFilename('en', 'cv-19.0-delta')).toBe(
      'cv-19.0-delta-en.tar.gz',
    )
  })

  it('generates delta licensed filename', () => {
    expect(
      generateTarFilename('en', 'cv-19.0-delta-licensed', 'CC0-1.0'),
    ).toBe('cv-19.0-delta-licensed-en-CC0-1.0.tar.gz')
  })
})

describe('pathsFilter', () => {
  describe('full release', () => {
    const filter = pathsFilter('full')

    it('excludes clips.tsv', () => {
      expect(filter('clips.tsv')).toBe(false)
    })

    it('includes CorporaCreator split files', () => {
      expect(filter('dev.tsv')).toBe(true)
      expect(filter('test.tsv')).toBe(true)
      expect(filter('train.tsv')).toBe(true)
    })

    it('includes other CorporaCreator files', () => {
      expect(filter('validated.tsv')).toBe(true)
      expect(filter('invalidated.tsv')).toBe(true)
      expect(filter('other.tsv')).toBe(true)
    })

    it('includes sentence files', () => {
      expect(filter('reported.tsv')).toBe(true)
      expect(filter('validated_sentences.tsv')).toBe(true)
      expect(filter('unvalidated_sentences.tsv')).toBe(true)
    })

    it('includes clip_durations.tsv', () => {
      expect(filter('clip_durations.tsv')).toBe(true)
    })

    it('includes clips directory', () => {
      expect(filter('clips')).toBe(true)
    })
  })

  describe('delta release', () => {
    const filter = pathsFilter('delta')

    it('excludes clips.tsv', () => {
      expect(filter('clips.tsv')).toBe(false)
    })

    it('excludes CorporaCreator split files', () => {
      expect(filter('dev.tsv')).toBe(false)
      expect(filter('test.tsv')).toBe(false)
      expect(filter('train.tsv')).toBe(false)
    })

    it('includes other CorporaCreator files', () => {
      expect(filter('validated.tsv')).toBe(true)
      expect(filter('invalidated.tsv')).toBe(true)
      expect(filter('other.tsv')).toBe(true)
    })

    it('includes sentence and reporting files', () => {
      expect(filter('reported.tsv')).toBe(true)
      expect(filter('validated_sentences.tsv')).toBe(true)
    })

    it('includes clips directory', () => {
      expect(filter('clips')).toBe(true)
    })
  })

  describe('variants release', () => {
    const filter = pathsFilter('variants')

    it('excludes clips.tsv', () => {
      expect(filter('clips.tsv')).toBe(false)
    })

    it('includes CorporaCreator split files (same as full)', () => {
      expect(filter('dev.tsv')).toBe(true)
      expect(filter('test.tsv')).toBe(true)
      expect(filter('train.tsv')).toBe(true)
    })

    it('includes other CorporaCreator files', () => {
      expect(filter('validated.tsv')).toBe(true)
      expect(filter('invalidated.tsv')).toBe(true)
      expect(filter('other.tsv')).toBe(true)
    })

    it('includes clip_durations.tsv', () => {
      expect(filter('clip_durations.tsv')).toBe(true)
    })

    it('includes clips directory', () => {
      expect(filter('clips')).toBe(true)
    })
  })

  it('works with full path (uses basename)', () => {
    const filter = pathsFilter('full')
    expect(filter('/some/path/to/clips.tsv')).toBe(false)
    expect(filter('/some/path/to/validated.tsv')).toBe(true)
  })
})

describe('decideCompressionLevel', () => {
  it('returns level 6 for small clip counts', () => {
    expect(decideCompressionLevel(0)).toBe(6)
    expect(decideCompressionLevel(100)).toBe(6)
    expect(decideCompressionLevel(9_999)).toBe(6)
  })

  it('returns level 1 at the threshold boundary', () => {
    expect(decideCompressionLevel(10_000)).toBe(1)
  })

  it('returns level 1 for large clip counts', () => {
    expect(decideCompressionLevel(100_000)).toBe(1)
    expect(decideCompressionLevel(2_500_000)).toBe(1)
  })
})

describe('shouldStreamToGCS', () => {
  it('always streams when clip count exceeds hard ceiling', () => {
    // Hard ceiling is STREAM_COMPRESS_CLIP_THRESHOLD (2,000,000) -- stream regardless of disk space
    expect(shouldStreamToGCS(STREAM_COMPRESS_CLIP_THRESHOLD, '/tmp', 'en')).toBe(true)
    expect(shouldStreamToGCS(STREAM_COMPRESS_CLIP_THRESHOLD + 500_000, '/tmp', 'en')).toBe(true)
  })

  afterEach(() => jest.resetAllMocks())

  it('uses local file when disk has enough space', () => {
    const ONE_GB = 1_073_741_824
    // du reports 1 GB data
    mockExecFileSync.mockReturnValue(`${ONE_GB}\t/release/en\n`)
    // 50 GB free (well above 1 GB data + 10 GB slack)
    mockStatfsSync.mockReturnValue({ bavail: 50 * ONE_GB, bsize: 1 })

    expect(shouldStreamToGCS(100, '/release', 'en')).toBe(false)
  })

  it('streams when disk space is insufficient', () => {
    const ONE_GB = 1_073_741_824
    // du reports 20 GB data
    mockExecFileSync.mockReturnValue(`${20 * ONE_GB}\t/release/en\n`)
    // 25 GB free (< 20 GB data + 10 GB slack = 30 GB needed)
    mockStatfsSync.mockReturnValue({ bavail: 25 * ONE_GB, bsize: 1 })

    expect(shouldStreamToGCS(100, '/release', 'en')).toBe(true)
  })

  it('streams when du measurement fails', () => {
    mockExecFileSync.mockImplementation(() => { throw new Error('du failed') })

    expect(shouldStreamToGCS(100, '/release', 'en')).toBe(true)
  })
})
