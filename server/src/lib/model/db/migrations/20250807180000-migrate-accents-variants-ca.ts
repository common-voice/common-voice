// Handles Accent => Variant migrations for `ca`
// Should not be re-used directly for other locales. Suggested steps:
// - Get statistics from live data
// - Replicate data in local dev environment
// - Do extensive testing
// For special cases, one should duplicate migrateAccentsToVariants_default => migrateAccentsToVariants_language_code and work on it
import {
  AV_MAPPING_TYPE,
  migrateAccentsToVariants_default,
} from '../migration-helpers'

const LOCALE_CODE = 'ca'

// MAPPING: [accent_token, variant_token]
// These are 1-to-1 mappings
const MAPPING: AV_MAPPING_TYPE = [
  ['central', 'ca-central'],
  ['balearic', 'ca-balear'],
  ['northwestern', 'ca-nwestern'],
  ['northern', 'ca-northern'],
]

//
// Do not change the code below unless database structure has been changed
//
export const up = async function (db: any): Promise<any> {
  return await migrateAccentsToVariants_default(db, LOCALE_CODE, MAPPING)
}

export const down = async function (): Promise<any> {
  // We cannot take it back
  return null
}
