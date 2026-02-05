export const COMMON_VOICE_EMAIL = 'commonvoice@mozilla.com'

// Features implemented in this application to be handled with middleware
export const FEATURES_COOKIE = 'mcv_features'
export const FEATURES = [
  'code-switch',
  'datasets-old',
  'papi-credentials',
  'bulk-upload',
]
export type Feature = typeof FEATURES[number]
export const FEATURE_DAYS = 30

// Audio Recording Constants (in milliseconds)
export const MIN_RECORDING_MS = 1000 // Minimum recording duration
export const MIN_RECORDING_MS_BENCHMARK = 500 // Minimum for benchmark mode
export const MAX_RECORDING_MS = 15000 // Maximum recording duration (15 seconds)
export const MAX_RECORDING_MS_WITH_HEADROOM = 17000 // Server-side validation with 2s headroom
export const CLIP_TRANSCODE_TIMEOUT_MS = 30000 // Maximum time for ffmpeg transcoding
export const MIN_VOLUME = 8 // Minimum recording volume threshold (0-255 range)
