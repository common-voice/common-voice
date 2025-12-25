import { TimeUnits } from 'common'

// Health check and monitoring intervals
export const HEALTH_CHECK_INTERVAL = 5 * TimeUnits.SECOND // 5 seconds always
export const ERROR_REPORT_INTERVAL = 60 * TimeUnits.SECOND // Report errors once per minute
export const PREFETCH_CHECK_INTERVAL = 5 * TimeUnits.MINUTE // Check every 5 minutes

// Failure thresholds
export const FAILURE_THRESHOLD = 5 // Require 5 consecutive failures before switching strategies

// Cold-start detection
export const COLD_START_PERIOD = 2 * TimeUnits.MINUTE // First 2 minutes are "cold start"
export const STARTUP_TIME = Date.now()

// Health check timeout
export const HEALTH_CHECK_TIMEOUT = 10000 // 10 seconds (increased)
