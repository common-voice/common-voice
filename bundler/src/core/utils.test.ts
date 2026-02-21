import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { countLinesInFile, formatDuration, unitToHours } from './utils'

// ---------------------------------------------------------------------------
// countLinesInFile
// ---------------------------------------------------------------------------

describe('countLinesInFile', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'utils-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('counts data rows, excluding the header', () => {
    const file = path.join(tmpDir, 'data.tsv')
    fs.writeFileSync(file, 'header\nrow1\nrow2\nrow3')
    expect(countLinesInFile(file)).toBe(3)
  })

  it('returns 0 for a header-only file', () => {
    const file = path.join(tmpDir, 'header-only.tsv')
    fs.writeFileSync(file, 'header')
    expect(countLinesInFile(file)).toBe(0)
  })

  it('returns 0 for an empty file', () => {
    const file = path.join(tmpDir, 'empty.tsv')
    fs.writeFileSync(file, '')
    expect(countLinesInFile(file)).toBe(0)
  })

  it('returns 0 for a missing file', () => {
    expect(countLinesInFile(path.join(tmpDir, 'nonexistent.tsv'))).toBe(0)
  })

  it('ignores blank / whitespace-only lines', () => {
    const file = path.join(tmpDir, 'blanks.tsv')
    fs.writeFileSync(file, 'header\nrow1\n\nrow2\n   \n')
    expect(countLinesInFile(file)).toBe(2)
  })

  it('handles a single data row', () => {
    const file = path.join(tmpDir, 'one-row.tsv')
    fs.writeFileSync(file, 'header\nrow1\n')
    expect(countLinesInFile(file)).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// unitToHours
// ---------------------------------------------------------------------------

describe('unitToHours', () => {
  it('converts milliseconds to hours', () => {
    expect(unitToHours(3_600_000, 'ms', 2)).toBe(1.0)
    expect(unitToHours(5_400_000, 'ms', 2)).toBe(1.5)
  })

  it('converts seconds to hours', () => {
    expect(unitToHours(3600, 's', 2)).toBe(1.0)
    expect(unitToHours(5400, 's', 2)).toBe(1.5)
  })

  it('converts minutes to hours', () => {
    expect(unitToHours(60, 'min', 2)).toBe(1.0)
    expect(unitToHours(90, 'min', 2)).toBe(1.5)
  })

  it('respects the sigDig decimal precision', () => {
    // 3 661 000 ms = 1.016... hrs → 1.01 at 2 sig digits (floor)
    expect(unitToHours(3_661_000, 'ms', 2)).toBe(1.01)
    // 0 sig digits → whole hours, floored
    expect(unitToHours(3_601_000, 'ms', 0)).toBe(1)
    // 3 sig digits
    expect(unitToHours(3_661_000, 'ms', 3)).toBe(1.016)
  })

  it('floors rather than rounds', () => {
    // 3 659 000 ms = 1.0163... hrs → floor at 2dp is 1.01, not 1.02
    expect(unitToHours(3_659_000, 'ms', 2)).toBe(1.01)
  })

  it('returns 0 for zero duration', () => {
    expect(unitToHours(0, 'ms', 2)).toBe(0)
    expect(unitToHours(0, 's', 2)).toBe(0)
    expect(unitToHours(0, 'min', 2)).toBe(0)
  })

  it('falls back to treating the value as hours for an unknown unit', () => {
    // The switch default leaves perHr = 1, so duration IS the hours value.
    // Cast needed to reach the dead branch at runtime.
    const result = unitToHours(2, 'unknown' as 'ms', 2)
    expect(result).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// formatDuration
// ---------------------------------------------------------------------------

describe('formatDuration', () => {
  it('formats zero as 00:00:00:00', () => {
    expect(formatDuration(0)).toBe('00:00:00:00')
  })

  it('formats sub-second duration (rounds down to 0 s)', () => {
    expect(formatDuration(500)).toBe('00:00:00:00')
  })

  it('formats seconds only', () => {
    expect(formatDuration(45_000)).toBe('00:00:00:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatDuration(65_500)).toBe('00:00:01:05')
  })

  it('formats hours, minutes, seconds', () => {
    expect(formatDuration(3_661_000)).toBe('00:01:01:01')
  })

  it('formats days, hours, minutes, seconds', () => {
    // 1 day + 2 h + 3 m + 4 s
    const ms = (1 * 86400 + 2 * 3600 + 3 * 60 + 4) * 1000
    expect(formatDuration(ms)).toBe('01:02:03:04')
  })

  it('pads single-digit components with a leading zero', () => {
    expect(formatDuration(9_000)).toBe('00:00:00:09')
  })
})
