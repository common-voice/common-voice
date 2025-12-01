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
