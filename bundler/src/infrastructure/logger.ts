import * as os from 'node:os'
import { LogLevel, Verbosity, VERBOSITY_CHOICES, getLogLevel } from '../config'

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
}

// Last 5 characters of the hostname --matches the pod suffix in GCP
// (e.g. "q2tjm" from "gha-bundler-...-q2tjm") and gives a short server
// identifier in local dev environments.
const SRV_ID = os.hostname().slice(-5)

let currentLevel: LogLevel = getLogLevel()

export const setLogLevel = (level: LogLevel): void => {
  currentLevel = level
}

// ---------------------------------------------------------------------------
// Verbosity -- controls both log level and subprocess output behaviour.
// Set once per job via applyVerbosity(); read by subprocess handlers via
// getVerbosity() to decide whether to stream/suppress child output.
// ---------------------------------------------------------------------------

const VERBOSITY_LOG_LEVEL: Record<Verbosity, LogLevel> = {
  quiet: 'warn',
  normal: 'info', // placeholder -- applyVerbosity uses env default
  verbose: 'debug',
  debug: 'debug',
}

let currentVerbosity: Verbosity = 'normal'

export const getVerbosity = (): Verbosity => currentVerbosity

/**
 * Applies a verbosity level: sets both the subprocess output verbosity
 * and the corresponding log level.
 *
 * For 'normal', the log level falls back to the environment-based default
 * (LOG_LEVEL env var / ENVIRONMENT), preserving existing behaviour.
 */
export const applyVerbosity = (v: Verbosity): void => {
  // Runtime guard: if an unexpected string is passed (e.g. from older jobs
  // or a CLI bug), fall back to 'normal' to keep log filtering intact.
  const safe: Verbosity =
    (VERBOSITY_CHOICES as readonly string[]).includes(v) ? v : 'normal'

  currentVerbosity = safe
  currentLevel =
    safe === 'normal' ? getLogLevel() : VERBOSITY_LOG_LEVEL[safe]
}

/**
 * Formats a timestamp as "2026-02-08T23:32:53.35" (truncated to centiseconds)
 * to match the GCP log format used in the pod-name prefix.
 */
const timestamp = (): string => new Date().toISOString().slice(0, 22)

const emit = (level: LogLevel, operation: string, message: string): void => {
  if (LEVEL_RANK[level] < LEVEL_RANK[currentLevel]) return

  const op = operation ? ` ${operation}` : ''

  // Hoist leading locale tag from message: "[en] rest" -> " [en]" before op.
  // Only matches BCP-47-like locale codes (e.g. en, pt-BR, zh-CN, nan-tw)
  // to avoid misclassifying filenames like "[validated.tsv]".
  let localeTag = ''
  let body = message
  const match = message.match(/^\[([a-z]{2,3}(?:-[a-zA-Z0-9]+)*)\]\s*/)
  if (match) {
    localeTag = ` ${match[0].trimEnd()}`
    body = message.slice(match[0].length)
  }

  const line = `[${SRV_ID}|${timestamp()}] ${level.toUpperCase().padEnd(5)}${localeTag}${op} ${body}`

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
