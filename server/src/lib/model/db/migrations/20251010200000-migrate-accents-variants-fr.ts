// Handles Accent => Variant migrations for `fr`
// Should not be re-used directly for other locales. Suggested steps:
// - Get statistics from live data
// - Replicate data in local dev environment
// - Do extensive testing
// For special cases, one should duplicate migrateAccentsToVariants_default => migrateAccentsToVariants_language_code and work on it
// To handle special case for French (re-grouping into continents) we added a third optional parameter "doDelete"
// The default is "true"
import {
  AV_MAPPING_TYPE,
  bulkDeleteAccentsWithReferences,
  migrateAccentsToVariants_default,
} from '../migration-helpers'

const LOCALE_CODE = 'fr'

// MAPPING: [accent_token, variant_token, doDelete?]
// These are 1-to-1 mappings in the order they are defined in DB, but grouped in regions
const MAPPING: AV_MAPPING_TYPE = [
  // Metro
  ['france', 'fr-metro'], // will be also force removed
  // droum - keep
  ['reunion', 'fr-droum', false],
  ['martinique', 'fr-droum', false],
  ['guadeloupe', 'fr-droum', false],
  ['new_caledonia', 'fr-droum', false],
  ['french_polynesia', 'fr-droum', false],
  ['mayotte', 'fr-droum', false],
  ['st_martin', 'fr-droum', false],
  ['wallis_et_futuna', 'fr-droum', false],
  ['st_barthelemy', 'fr-droum', false],
  ['st_pierre_et_miquelon', 'fr-droum', false],
  ['french_guiana', 'fr-droum', false],
  // Europe - keep
  ['germany', 'fr-europe', false],
  ['united_kingdom', 'fr-europe', false],
  ['netherlands', 'fr-europe', false],
  ['belgium', 'fr-europe', false],
  ['italy', 'fr-europe', false],
  ['romania', 'fr-europe', false],
  ['switzerland', 'fr-europe', false],
  ['luxembourg', 'fr-europe', false],
  ['monaco', 'fr-europe', false],
  // Europe - remove if possible
  ['portugal', 'fr-europe'],
  ['greece', 'fr-europe'],
  ['austria', 'fr-europe'],
  ['ireland', 'fr-europe'],
  ['hungary', 'fr-europe'],
  ['cyprus', 'fr-europe'],
  ['malta', 'fr-europe'],
  ['andorra', 'fr-europe'],
  // North Africa - keep
  ['tunisia', 'fr-nafrica', false],
  ['algeria', 'fr-nafrica', false],
  ['morocco', 'fr-nafrica', false],
  ['mauritania', 'fr-nafrica', false],
  // South Africa - keep
  ['madagascar', 'fr-safrica', false],
  ['cameroon', 'fr-safrica', false],
  ['cote_d_ivoire', 'fr-safrica', false],
  ['mali', 'fr-safrica', false],
  ['senegal', 'fr-safrica', false],
  ['niger', 'fr-safrica', false],
  ['togo', 'fr-safrica', false],
  ['congo_kinshasa', 'fr-safrica', false],
  ['benin', 'fr-safrica', false],
  ['comoros', 'fr-safrica', false],
  ['seychelles', 'fr-safrica', false],
  ['mauritius', 'fr-safrica', false],
  // South Africa - remove if possible
  ['burundi', 'fr-safrica'],
  ['burkina_faso', 'fr-safrica'],
  ['central_african_republic', 'fr-safrica'],
  ['congo_brazzaville', 'fr-safrica'],
  ['guinea', 'fr-safrica'],
  ['chad', 'fr-safrica'],
  ['gabon', 'fr-safrica'],
  ['equatorial_guinea', 'fr-safrica'],
  ['djibouti', 'fr-safrica'],
  ['rwanda', 'fr-safrica'],
  // North America - keep
  ['canada', 'fr-namerica', false],
  ['united_states', 'fr-namerica', false],
  // South America - keep
  ['haiti', 'fr-samerica', false],
  // Asia - remove if possible
  ['syria', 'fr-asia'],
  ['vanuatu', 'fr-asia'],
  ['lebanon', 'fr-asia'],
]

// List of accents which should be removed as they will be duplicated/mixed with variants
const FORCE_REMOVE_ACCENTS = ['france'] // 58 users should re-select variant and one of the 4 new fr-metro-* accents

//
// Do not change the code below unless database structure has been changed
//
export const up = async function (db: any): Promise<any> {
  await migrateAccentsToVariants_default(db, LOCALE_CODE, MAPPING)
  if (FORCE_REMOVE_ACCENTS && FORCE_REMOVE_ACCENTS.length > 0) {
    await bulkDeleteAccentsWithReferences(db, LOCALE_CODE, FORCE_REMOVE_ACCENTS)
  }
  return true
}

export const down = async function (): Promise<any> {
  // We cannot take it back
  return null
}
