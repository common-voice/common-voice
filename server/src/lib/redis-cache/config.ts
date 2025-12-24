import { getConfig } from '../../config-helper'
import { COLD_START_PERIOD, STARTUP_TIME } from './constants'

// Logging control - enable debug in local/sandbox environments
export const isDebugEnabled = ['local', 'sandbox', 'stage'].includes(
  getConfig().ENVIRONMENT
)

// Cold-start detection: returns true during first N minutes after startup
export function isColdStart(): boolean {
  return Date.now() - STARTUP_TIME < COLD_START_PERIOD
}
