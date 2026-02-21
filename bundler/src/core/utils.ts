import * as fs from 'node:fs'

import { TimeUnitsMs, TimeUnitsSec } from '../config/config'

// -- Filesystem --------------------------------------------------------------

/**
 * Count data lines (total minus header) in a TSV/CSV file.
 * Returns 0 if the file is missing or unreadable.
 */
export const countLinesInFile = (filepath: string): number => {
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    const lines = content.split('\n').filter(l => l.trim().length > 0)
    return Math.max(0, lines.length - 1) // subtract header
  } catch {
    return 0
  }
}

// -- Math / unit conversion --------------------------------------------------

/**
 * Convert a duration to fractional hours, rounded to `sigDig` decimal places.
 */
export const unitToHours = (
  duration: number,
  unit: 'ms' | 's' | 'min',
  sigDig: number,
): number => {
  let perHr = 1
  const sigDigMultiplier = 10 ** sigDig

  switch (unit) {
    case 'ms':
      perHr = TimeUnitsMs.HOUR
      break
    case 's':
      perHr = TimeUnitsSec.HOUR
      break
    case 'min':
      perHr = TimeUnitsSec.MINUTE
      break
    default:
      perHr = 1
      break
  }

  return Math.floor((duration / perHr) * sigDigMultiplier) / sigDigMultiplier
}

// -- Duration formatting -----------------------------------------------------
// Formats a duration in milliseconds as a `dd:hh:mm:ss` string.

export const formatDuration = (durationMs: number): string => {
  const totalSec = Math.max(0, Math.floor(durationMs / TimeUnitsMs.SECOND))
  const dd = Math.floor(totalSec / TimeUnitsSec.DAY)
  const hh = Math.floor((totalSec % TimeUnitsSec.DAY) / TimeUnitsSec.HOUR)
  const mm = Math.floor((totalSec % TimeUnitsSec.HOUR) / TimeUnitsSec.MINUTE)
  const ss = totalSec % TimeUnitsSec.MINUTE
  return [dd, hh, mm, ss].map(n => String(n).padStart(2, '0')).join(':')
}
