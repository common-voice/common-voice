// 1. Re-Handles Accent => Variant migrations for `ga-IE`
// 2. Removes any remaining user-accent selections for these
// 3. Removes the accents themselves
import {
  AV_MAPPING_TYPE,
  migrateAccentsToVariants_default,
  bulkDeleteAccentsWithReferences
} from '../migration-helpers'

const LOCALE_CODE = 'ga-IE'

// MAPPING: [accent_token, variant_token]
// These are 1-to-1 mappings
const MAPPING: AV_MAPPING_TYPE = [
  ['connachta', 'ga-IE-chonnact'],
  ['mumhain', 'ga-IE-mumhan'],
  ['ulaidh', 'ga-IE-uladh'], // this should not be found
]

//
// Do not change the code below unless database structure has been changed
//
export const up = async function (db: any): Promise<any> {
  // 1. re-apply previous algorithm 
  await migrateAccentsToVariants_default(db, LOCALE_CODE, MAPPING)
  // 2 & 3. Get accent list and remove them from "user_client_accents" table, then delete accents
  const accent_tokens: string[] = MAPPING.map((m) => m[0]) // first item on each tuple is accent_token
  await bulkDeleteAccentsWithReferences(db, LOCALE_CODE, accent_tokens)
}

export const down = async function (): Promise<any> {
  // We cannot take it back
  return null
}
