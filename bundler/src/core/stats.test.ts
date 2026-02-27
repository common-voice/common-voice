import { unitToHours } from './utils'
import { buildLocale } from './stats'
import type { LocaleReleaseData } from './localeData'

describe('unitToHours', () => {
  describe('milliseconds to hours', () => {
    it('converts 3,600,000 ms to 1 hour', () => {
      expect(unitToHours(3_600_000, 'ms', 2)).toBe(1)
    })

    it('converts 0 ms to 0 hours', () => {
      expect(unitToHours(0, 'ms', 2)).toBe(0)
    })

    it('truncates (floors) to specified significant digits', () => {
      // 5_400_000 ms = 1.5 hours
      expect(unitToHours(5_400_000, 'ms', 2)).toBe(1.5)
      // 4_000_000 ms = 1.1111... hours -> floor at 2 sigDig = 1.11
      expect(unitToHours(4_000_000, 'ms', 2)).toBe(1.11)
    })

    it('handles large durations', () => {
      // 360,000,000 ms = 100 hours
      expect(unitToHours(360_000_000, 'ms', 2)).toBe(100)
    })
  })

  describe('seconds to hours', () => {
    it('converts 3600 s to 1 hour', () => {
      expect(unitToHours(3600, 's', 2)).toBe(1)
    })

    it('converts 5400 s to 1.5 hours', () => {
      expect(unitToHours(5400, 's', 2)).toBe(1.5)
    })
  })

  describe('minutes to hours', () => {
    it('converts 60 min to 1 hour', () => {
      expect(unitToHours(60, 'min', 2)).toBe(1)
    })

    it('converts 90 min to 1.5 hours', () => {
      expect(unitToHours(90, 'min', 2)).toBe(1.5)
    })
  })

  describe('significant digits', () => {
    it('floors to 0 decimal places', () => {
      // 5_400_000 ms = 1.5 hours -> floor at 0 sigDig = 1
      expect(unitToHours(5_400_000, 'ms', 0)).toBe(1)
    })

    it('floors to 3 decimal places', () => {
      // 4_000_000 ms = 1.11111... hours -> floor at 3 sigDig = 1.111
      expect(unitToHours(4_000_000, 'ms', 3)).toBe(1.111)
    })
  })
})

describe('buildLocale', () => {
  const makeLocaleData = (
    overrides: Partial<LocaleReleaseData> = {},
  ): LocaleReleaseData => ({
    clips: 100,
    speakers: 20,
    genderCounts: { male_masculine: 50, female_feminine: 30, '': 20 },
    ageCounts: { twenties: 40, thirties: 30, '': 30 },
    domainCounts: { general: 80, healthcare: 20 },
    variantCounts: {},
    accentCounts: {},
    buckets: {
      dev: 10,
      test: 10,
      train: 50,
      validated: 80,
      invalidated: 10,
      other: 10,
    },
    reportedSentences: 5,
    validatedSentences: 60,
    unvalidatedSentences: 20,
    rejectedSentences: 3,
    pendingSentences: 17,
    sourceCounts: { wiki: 50 },
    sentenceVariantCounts: {},
    totalDurationMs: 3_600_000,
    totalHrs: 1,
    validHrs: 0.8,
    avgDurationSecs: 36,
    validDurationSecs: 2880,
    sentencesSample: ['Hello world'],
    ...overrides,
  })

  it('maps all LocaleReleaseData fields to Locale output', () => {
    const data = makeLocaleData()
    const result = buildLocale(data, 'abc123', 1024)

    expect(result.clips).toBe(100)
    expect(result.users).toBe(20)
    expect(result.duration).toBe(3_600_000)
    expect(result.totalHrs).toBe(1)
    expect(result.validHrs).toBe(0.8)
    expect(result.avgDurationSecs).toBe(36)
    expect(result.validDurationSecs).toBe(2880)
    expect(result.checksum).toBe('abc123')
    expect(result.size).toBe(1024)
  })

  it('maps buckets directly from LocaleReleaseData', () => {
    const data = makeLocaleData()
    const result = buildLocale(data, '', 0)

    expect(result.buckets).toEqual({
      dev: 10,
      test: 10,
      train: 50,
      validated: 80,
      invalidated: 10,
      other: 10,
    })
  })

  it('maps demographic splits from count records', () => {
    const data = makeLocaleData()
    const result = buildLocale(data, '', 0)

    expect(result.splits.gender).toEqual({
      male_masculine: 50,
      female_feminine: 30,
      '': 20,
    })
    expect(result.splits.age).toEqual({
      twenties: 40,
      thirties: 30,
      '': 30,
    })
    expect(result.splits.sentence_domain).toEqual({
      general: 80,
      healthcare: 20,
    })
    expect(result.splits.accent).toEqual({})
  })

  it('maps sentence counts', () => {
    const data = makeLocaleData()
    const result = buildLocale(data, '', 0)

    expect(result.reportedSentences).toBe(5)
    expect(result.validatedSentences).toBe(60)
    expect(result.unvalidatedSentences).toBe(20)
  })

  it('handles zero-clip locale', () => {
    const data = makeLocaleData({
      clips: 0,
      speakers: 0,
      genderCounts: {},
      ageCounts: {},
      domainCounts: {},
      buckets: {
        dev: 0,
        test: 0,
        train: 0,
        validated: 0,
        invalidated: 0,
        other: 0,
      },
      totalDurationMs: 0,
      totalHrs: 0,
      validHrs: 0,
      avgDurationSecs: 0,
      validDurationSecs: 0,
    })
    const result = buildLocale(data, 'empty', 0)

    expect(result.clips).toBe(0)
    expect(result.users).toBe(0)
    expect(result.duration).toBe(0)
    expect(result.splits.gender).toEqual({})
    expect(result.splits.age).toEqual({})
  })
})
