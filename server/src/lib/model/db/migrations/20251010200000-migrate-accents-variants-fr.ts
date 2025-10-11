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
  migrateAccentsToVariants_default,
} from '../migration-helpers'

const LOCALE_CODE = 'fr'

// MAPPING: [accent_token, variant_token, doDelete?]
// These are 1-to-1 mappings in the order they are defined in DB, but grouped in regions
const MAPPING: AV_MAPPING_TYPE = [
  // Metro
  ['france', 'fr-metro', true], // remove
  // droum
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
  // Europe
  ['germany', 'fr-europe', false],
  ['united_kingdom', 'fr-europe', false],
  ['netherlands', 'fr-europe', false],
  ['belgium', 'fr-europe', false],
  ['italy', 'fr-europe', false],
  ['romania', 'fr-europe', false],
  ['switzerland', 'fr-europe', false],
  ['portugal', 'fr-europe', false],
  ['greece', 'fr-europe', true], // remove
  ['austria', 'fr-europe', false],
  ['ireland', 'fr-europe', false],
  ['luxembourg', 'fr-europe', false],
  ['hungary', 'fr-europe', true], // remove
  ['cyprus', 'fr-europe', true], // remove
  ['malta', 'fr-europe', true], // remove
  ['monaco', 'fr-europe', false],
  ['andorra', 'fr-europe', true], // remove
  // North Africa
  ['tunisia', 'fr-nafrica', false],
  ['algeria', 'fr-nafrica', false],
  ['morocco', 'fr-nafrica', false],
  ['mauritania', 'fr-nafrica', false],
  // South Africa
  ['madagascar', 'fr-safrica', false],
  ['cameroon', 'fr-safrica', false],
  ['cote_d_ivoire', 'fr-safrica', false],
  ['mali', 'fr-safrica', false],
  ['burundi', 'fr-safrica', false],
  ['senegal', 'fr-safrica', false],
  ['niger', 'fr-safrica', false],
  ['togo', 'fr-safrica', false],
  ['burkina_faso', 'fr-safrica', false],
  ['congo_brazzaville', 'fr-safrica', false],
  ['congo_kinshasa', 'fr-safrica', false],
  ['benin', 'fr-safrica', false],
  ['guinea', 'fr-safrica', false],
  ['chad', 'fr-safrica', false],
  ['central_african_republic', 'fr-safrica', false],
  ['gabon', 'fr-safrica', false],
  ['comoros', 'fr-safrica', false],
  ['equatorial_guinea', 'fr-safrica', false],
  ['seychelles', 'fr-safrica', false],
  ['mauritius', 'fr-safrica', false],
  ['djibouti', 'fr-safrica', false],
  ['rwanda', 'fr-safrica', false],
  // North America
  ['canada', 'fr-namerica', false],
  ['united_states', 'fr-namerica', false],
  // South America
  ['haiti', 'fr-samerica', false],
  ['french_guiana', 'fr-samerica', false],
  // Asia
  ['syria', 'fr-asia', true],
  ['vanuatu', 'fr-asia', false],
  ['lebanon', 'fr-asia', false],
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
