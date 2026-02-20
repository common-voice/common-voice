import * as os from 'node:os'
import { LogLevel, getLogLevel } from '../config/config'

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Last 5 characters of the hostname — matches the pod suffix in GCP
// (e.g. "q2tjm" from "gha-bundler-...-q2tjm") and gives a short server
// identifier in local dev environments.
const SRV_ID = os.hostname().slice(-5)

let currentLevel: LogLevel = getLogLevel()

export const setLogLevel = (level: LogLevel): void => {
  currentLevel = level
}

/**
 * Formats a timestamp as "2026-02-08T23:32:53.35" (truncated to centiseconds)
 * to match the GCP log format used in the pod-name prefix.
 */
const timestamp = (): string => new Date().toISOString().slice(0, 22)

const emit = (level: LogLevel, operation: string, message: string): void => {
  if (LEVEL_RANK[level] < LEVEL_RANK[currentLevel]) return

  const line = `[${SRV_ID} - ${timestamp()}] ${level.toUpperCase().padEnd(5)} ${operation} ${message}`

  if (level === 'error' || level === 'warn') {
    process.stderr.write(line + '\n')
  } else {
    process.stdout.write(line + '\n')
  }
}

export const logger = {
  debug: (operation: string, message: string): void =>
    emit('debug', operation, message),
  info: (operation: string, message: string): void =>
    emit('info', operation, message),
  warn: (operation: string, message: string): void =>
    emit('warn', operation, message),
  error: (operation: string, message: string): void =>
    emit('error', operation, message),
}
