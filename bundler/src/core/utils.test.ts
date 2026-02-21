import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { countLinesInFile, unitToHours } from './utils'

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
