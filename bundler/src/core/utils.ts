import * as fs from 'node:fs'

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
      perHr = 60 * 60 * 1000
      break
    case 's':
      perHr = 60 * 60
      break
    case 'min':
      perHr = 60
      break
    default:
      perHr = 1
      break
  }

  return Math.floor((duration / perHr) * sigDigMultiplier) / sigDigMultiplier
}
