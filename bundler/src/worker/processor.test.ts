import { deriveJobEnv } from './processor'
import { ProcessLocaleJob } from '../types'

const TMP_DIR = '/tmp/bundler'

const baseJob: ProcessLocaleJob = {
  type: 'full',
  from: '2025-01-01 00:00:00',
  until: '2025-06-01 00:00:00',
  releaseName: 'cv-19.0',
  previousReleaseName: 'cv-18.0',
  languages: ['en'],
  locale: 'en',
}

describe('deriveJobEnv', () => {
  describe('effectiveReleaseName', () => {
    it('uses releaseName as-is for unlicensed jobs', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.releaseName).toBe('cv-19.0')
    })

    it('appends -licensed for licensed jobs', () => {
      const env = deriveJobEnv({ ...baseJob, license: 'CC-BY-SA-4.0' }, TMP_DIR)
      expect(env.releaseName).toBe('cv-19.0-licensed')
    })
  })

  describe('effectivePreviousReleaseName', () => {
    it('derives previous release name for full unlicensed', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.previousReleaseName).toBe('cv-18.0')
    })

    it('appends -licensed to previous release for full licensed', () => {
      const env = deriveJobEnv({ ...baseJob, license: 'CC0-1.0' }, TMP_DIR)
      expect(env.previousReleaseName).toBe('cv-18.0-licensed')
    })

    it('is undefined for delta releases (unlicensed)', () => {
      const env = deriveJobEnv({ ...baseJob, type: 'delta' }, TMP_DIR)
      expect(env.previousReleaseName).toBeUndefined()
    })

    it('is undefined for delta releases (licensed)', () => {
      const env = deriveJobEnv(
        { ...baseJob, type: 'delta', license: 'CC0-1.0' },
        TMP_DIR,
      )
      expect(env.previousReleaseName).toBeUndefined()
    })

    it('is undefined for statistics releases', () => {
      const env = deriveJobEnv({ ...baseJob, type: 'statistics' }, TMP_DIR)
      expect(env.previousReleaseName).toBeUndefined()
    })

    it('is undefined when no previousReleaseName is provided', () => {
      const { previousReleaseName: _, ...jobWithoutPrev } = baseJob
      const env = deriveJobEnv(jobWithoutPrev as ProcessLocaleJob, TMP_DIR)
      expect(env.previousReleaseName).toBeUndefined()
    })
  })

  describe('effectiveDeltaReleaseName', () => {
    it('derives delta name for full unlicensed', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.deltaReleaseName).toBe('cv-19.0-delta')
    })

    it('derives delta-licensed name for full licensed', () => {
      const env = deriveJobEnv({ ...baseJob, license: 'CC-BY-SA-4.0' }, TMP_DIR)
      expect(env.deltaReleaseName).toBe('cv-19.0-delta-licensed')
    })

    it('is undefined for delta releases', () => {
      const env = deriveJobEnv({ ...baseJob, type: 'delta' }, TMP_DIR)
      expect(env.deltaReleaseName).toBeUndefined()
    })

    it('is undefined for statistics releases', () => {
      const env = deriveJobEnv({ ...baseJob, type: 'statistics' }, TMP_DIR)
      expect(env.deltaReleaseName).toBeUndefined()
    })
  })

  describe('releaseDirPath', () => {
    it('is tmpDir/releaseName for unlicensed', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.releaseDirPath).toBe('/tmp/bundler/cv-19.0')
    })

    it('includes license subdirectory for licensed', () => {
      const env = deriveJobEnv({ ...baseJob, license: 'CC-BY-SA-4.0' }, TMP_DIR)
      expect(env.releaseDirPath).toBe('/tmp/bundler/cv-19.0-licensed/CC-BY-SA-4.0')
    })

    it('sanitizes special characters in license subdirectory', () => {
      const env = deriveJobEnv({ ...baseJob, license: 'CC BY/NC' }, TMP_DIR)
      expect(env.releaseDirPath).toBe('/tmp/bundler/cv-19.0-licensed/CC_BY_NC')
    })
  })

  describe('derived paths', () => {
    it('sets clipsDirPath under releaseDirPath/locale/clips', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.clipsDirPath).toBe('/tmp/bundler/cv-19.0/en/clips')
    })

    it('sets releaseTarballsDirPath under releaseDirPath/tarballs', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.releaseTarballsDirPath).toBe('/tmp/bundler/cv-19.0/tarballs')
    })

    it('paths are correct for licensed jobs', () => {
      const env = deriveJobEnv({ ...baseJob, license: 'CC0-1.0' }, TMP_DIR)
      expect(env.clipsDirPath).toBe('/tmp/bundler/cv-19.0-licensed/CC0-1.0/en/clips')
      expect(env.releaseTarballsDirPath).toBe(
        '/tmp/bundler/cv-19.0-licensed/CC0-1.0/tarballs',
      )
    })
  })

  describe('uploadPath', () => {
    it('is releaseName/releaseName-locale.tar.gz for unlicensed', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.uploadPath).toBe('cv-19.0/cv-19.0-en.tar.gz')
    })

    it('includes -licensed suffix and sanitized license for licensed jobs', () => {
      const env = deriveJobEnv({ ...baseJob, license: 'CC-BY-SA-4.0' }, TMP_DIR)
      expect(env.uploadPath).toBe(
        'cv-19.0-licensed/cv-19.0-licensed-en-CC-BY-SA-4.0.tar.gz',
      )
    })

    it('sanitizes special characters in license portion', () => {
      const env = deriveJobEnv({ ...baseJob, license: 'CC BY/NC' }, TMP_DIR)
      expect(env.uploadPath).toBe(
        'cv-19.0-licensed/cv-19.0-licensed-en-CC_BY_NC.tar.gz',
      )
    })
  })

  describe('accumulator fields', () => {
    it('initialises problemClips as an empty array', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.problemClips).toEqual([])
    })

    it('initialises clipCount to 0', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.clipCount).toBe(0)
    })

    it('initialises startTimestamp as an ISO 8601 string within the current second', () => {
      const before = new Date().toISOString()
      const env = deriveJobEnv(baseJob, TMP_DIR)
      const after = new Date().toISOString()
      expect(env.startTimestamp >= before).toBe(true)
      expect(env.startTimestamp <= after).toBe(true)
    })
  })

  describe('passthrough fields', () => {
    it('preserves locale, from, until, type from job data', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.locale).toBe('en')
      expect(env.from).toBe('2025-01-01 00:00:00')
      expect(env.until).toBe('2025-06-01 00:00:00')
      expect(env.type).toBe('full')
    })

    it('preserves license field', () => {
      const env = deriveJobEnv({ ...baseJob, license: 'CC0-1.0' }, TMP_DIR)
      expect(env.license).toBe('CC0-1.0')
    })

    it('license is undefined for unlicensed jobs', () => {
      const env = deriveJobEnv(baseJob, TMP_DIR)
      expect(env.license).toBeUndefined()
    })
  })
})
