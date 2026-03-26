import * as fs from 'node:fs'

/**
 * Reads memory stats from /proc for a given PID. Returns a human-readable
 * summary string, or 'unavailable' if /proc is not accessible (e.g. macOS/Windows).
 */
export const readProcMemory = (pid: number): string => {
  try {
    const status = fs.readFileSync(`/proc/${pid}/status`, 'utf8')
    const vmRSS = status.match(/VmRSS:\s+(\d+ \w+)/)?.[1] ?? '?'
    const vmSize = status.match(/VmSize:\s+(\d+ \w+)/)?.[1] ?? '?'
    return `RSS=${vmRSS} VM=${vmSize}`
  } catch {
    return 'unavailable'
  }
}

/**
 * Returns a compact summary of Node.js heap and system memory usage.
 * Safe to call at any time -- uses only process.memoryUsage().
 */
export const getNodeMemSummary = (): string => {
  const mem = process.memoryUsage()
  const fmt = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(0)}MB`
  return `heap=${fmt(mem.heapUsed)}/${fmt(mem.heapTotal)} rss=${fmt(mem.rss)} ext=${fmt(mem.external)}`
}
