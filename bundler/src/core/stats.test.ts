import { unitToHours, mapLineCountsToStats } from './stats'
import { LineCounts } from '../infrastructure/filesystem'

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
      // 4_000_000 ms = 1.1111... hours → floor at 2 sigDig = 1.11
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
      // 5_400_000 ms = 1.5 hours → floor at 0 sigDig = 1
      expect(unitToHours(5_400_000, 'ms', 0)).toBe(1)
    })

    it('floors to 3 decimal places', () => {
      // 4_000_000 ms = 1.11111... hours → floor at 3 sigDig = 1.111
      expect(unitToHours(4_000_000, 'ms', 3)).toBe(1.111)
    })
  })
})

describe('mapLineCountsToStats', () => {
  const fullLineCounts: LineCounts = {
    'dev.tsv': 11,
    'test.tsv': 21,
    'train.tsv': 51,
    'validated.tsv': 81,
    'invalidated.tsv': 6,
    'other.tsv': 16,
    'reported.tsv': 4,
    'validated_sentences.tsv': 101,
    'unvalidated_sentences.tsv': 31,
  }

  it('maps CC file line counts to buckets (minus 1 for header)', () => {
    const result = mapLineCountsToStats(fullLineCounts)
    expect(result.buckets).toEqual({
      dev: 10,
      test: 20,
      train: 50,
      validated: 80,
      invalidated: 5,
      other: 15,
    })
  })

  it('maps reported sentences (minus 1 for header)', () => {
    const result = mapLineCountsToStats(fullLineCounts)
    expect(result.reportedSentences).toBe(3)
  })

  it('maps validated sentences (minus 1 for header)', () => {
    const result = mapLineCountsToStats(fullLineCounts)
    expect(result.validatedSentences).toBe(100)
  })

  it('maps unvalidated sentences (minus 1 for header)', () => {
    const result = mapLineCountsToStats(fullLineCounts)
    expect(result.unvalidatedSentences).toBe(30)
  })

  it('ignores non-CC files in buckets', () => {
    const counts: LineCounts = {
      'dev.tsv': 5,
      'test.tsv': 3,
      'train.tsv': 2,
      'validated.tsv': 10,
      'invalidated.tsv': 1,
      'other.tsv': 1,
      'reported.tsv': 1,
      'validated_sentences.tsv': 1,
      'unvalidated_sentences.tsv': 1,
      'clips.tsv': 100, // not a CC file — should not appear in buckets
    }
    const result = mapLineCountsToStats(counts)
    expect(result.buckets).not.toHaveProperty('clips')
  })

  it('handles files with only header (1 line → 0 data rows)', () => {
    const counts: LineCounts = {
      'dev.tsv': 1,
      'test.tsv': 1,
      'train.tsv': 1,
      'validated.tsv': 1,
      'invalidated.tsv': 1,
      'other.tsv': 1,
      'reported.tsv': 1,
      'validated_sentences.tsv': 1,
      'unvalidated_sentences.tsv': 1,
    }
    const result = mapLineCountsToStats(counts)
    expect(result.buckets.dev).toBe(0)
    expect(result.reportedSentences).toBe(0)
  })
})
