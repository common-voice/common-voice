import * as fs from 'node:fs'

import { TimeUnitsMs, TimeUnitsSec } from '../config'

// -- Filesystem --------------------------------------------------------------

/**
 * Count newline-separated lines minus the header row in a TSV/CSV file.
 * Counts all lines including blank/whitespace-only rows (CC output has none).
 * Returns 0 if the file is missing, unreadable, or header-only.
 *
 * Streams the file in chunks to avoid loading multi-GB files into memory.
 */
export const countLinesInFile = (filepath: string): Promise<number> =>
  new Promise(resolve => {
    if (!fs.existsSync(filepath)) return resolve(0)

    let lines = 0
    let lastByte = 0

    const stream = fs.createReadStream(filepath)
    stream.on('data', (chunk: Buffer) => {
      for (let i = 0; i < chunk.length; i++) {
        if (chunk[i] === 0x0a) lines++
      }
      lastByte = chunk[chunk.length - 1]
    })
    stream.on('end', () => {
      // No trailing newline means the last line wasn't counted yet
      if (lastByte !== 0x0a && lastByte !== 0) lines++
      resolve(Math.max(0, lines - 1)) // subtract header
    })
    stream.on('error', () => resolve(0))
  })

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

// -- Progress bar helpers ----------------------------------------------------

/** Renders a fixed-width ASCII progress bar. `ratio` is clamped to [0, 1]. */
export const renderBar = (ratio: number, width: number): string => {
  const clamped = Math.max(0, Math.min(1, ratio))
  const filled = Math.round(clamped * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

/**
 * Formats a number in compact notation: 89, 1.2K, 2.3M, 1.1B.
 * Values below 1000 are shown as integers.
 */
export const formatCompact = (n: number): string => {
  if (n < 1_000) return String(Math.round(n))
  if (n < 1_000_000) return (n / 1_000).toFixed(1) + 'K'
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  return (n / 1_000_000_000).toFixed(1) + 'B'
}

/**
 * Formats milliseconds as a compact human-readable duration: 8s, 3m12s, 1h32m, 2d5h.
 * Returns '--' for zero or negative values.
 */
export const formatEta = (ms: number): string => {
  if (ms <= 0) return '--'
  const sec = Math.floor(ms / TimeUnitsMs.SECOND)
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  const remSec = sec % 60
  if (min < 60) return `${min}m${remSec > 0 ? String(remSec).padStart(2, '0') + 's' : ''}`
  const hr = Math.floor(min / 60)
  const remMin = min % 60
  if (hr < 24) return `${hr}h${remMin > 0 ? String(remMin).padStart(2, '0') + 'm' : ''}`
  const day = Math.floor(hr / 24)
  const remHr = hr % 24
  return `${day}d${remHr > 0 ? remHr + 'h' : ''}`
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
