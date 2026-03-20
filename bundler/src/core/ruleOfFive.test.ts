jest.mock('../infrastructure/redis')
jest.mock('../infrastructure/queue')
jest.mock('../infrastructure/database')

import { isMinorityLanguage } from './ruleOfFive'
import { query } from '../infrastructure/database'
import { AppEnv } from '../types'

const mockQuery = query as jest.Mock

const makeEnv = (overrides: Partial<AppEnv> = {}): AppEnv => ({
  type: 'full',
  from: '2020-01-01',
  until: '2026-01-01',
  releaseName: 'cv-corpus-25.0-2026-03-06',
  languages: ['en'],
  locale: 'en',
  releaseDirPath: '/tmp/test',
  clipsDirPath: '/tmp/test/en/clips',
  releaseTarballsDirPath: '/tmp/test/tarballs',
  uploadPath: 'cv-corpus-25.0-2026-03-06/cv-corpus-25.0-2026-03-06-en.tar.gz',
  problemClips: [],
  clipCount: 0,
  startTimestamp: new Date().toISOString(),
  ...overrides,
})

describe('isMinorityLanguage', () => {
  beforeEach(() => {
    mockQuery.mockReset()
  })

  it('returns true when unique speakers < 5', async () => {
    mockQuery.mockReturnValue(async () => ({
      _tag: 'Right',
      right: { name: 'en', count: 3 },
    }))

    const result = await isMinorityLanguage()(makeEnv())()
    expect(result).toEqual({ _tag: 'Right', right: true })
  })

  it('returns false when unique speakers >= 5', async () => {
    mockQuery.mockReturnValue(async () => ({
      _tag: 'Right',
      right: { name: 'en', count: 10 },
    }))

    const result = await isMinorityLanguage()(makeEnv())()
    expect(result).toEqual({ _tag: 'Right', right: false })
  })

  it('returns false when unique speakers == 5 (boundary)', async () => {
    mockQuery.mockReturnValue(async () => ({
      _tag: 'Right',
      right: { name: 'en', count: 5 },
    }))

    const result = await isMinorityLanguage()(makeEnv())()
    expect(result).toEqual({ _tag: 'Right', right: false })
  })

  it('returns Left when query fails', async () => {
    mockQuery.mockReturnValue(async () => ({
      _tag: 'Left',
      left: new Error('DB connection failed'),
    }))

    const result = await isMinorityLanguage()(makeEnv())()
    expect(result._tag).toBe('Left')
  })

  it('passes locale from env to query', async () => {
    mockQuery.mockReturnValue(async () => ({
      _tag: 'Right',
      right: { name: 'cy', count: 2 },
    }))

    await isMinorityLanguage()(makeEnv({ locale: 'cy' }))()
    expect(mockQuery).toHaveBeenCalled()
  })
})
