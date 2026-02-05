/* eslint-disable @typescript-eslint/no-explicit-any */
// Handles User Defined Accent => New Predefined Accent+Variant migrations for `ro`
// Should not be re-used directly for other locales. Suggested steps:
// - Get statistics from live data
// - Replicate data in local dev environment
// - Do extensive testing
// For special cases, one should duplicate migrateAccentsToVariants_default => migrateAccentsToVariants_language_code and work on it
//
// Romanian accents and variants are recently created in https://github.com/common-voice/common-voice/pull/5220,
// and fixed in 20260101070000-fix-ro-accent.ts migration - due to user defined accents
// In this migration we re-assign user created accents to new ones and also move them to variants
// This procedure is different from previous migrations:
// - We created accents/variants recently, old users only had user defined accents
// - We need to map existing user-defined accents to both new accents AND new variants simultaneously
// - Old user-defined accents should be deleted after migration
//
import {
  AV_MAPPING_TYPE,
  AAV_MAPPING_TYPE,
  migrateAccentsToVariants_default,
  migrateAccentsToAccentsAndVariants_default,
} from '../migration-helpers'

const LOCALE_CODE = 'ro'

// STEP 1: Mapping for accent -> variant only (for Moldovan accents going to ro-MD variant)
// MAPPING: [accent_token, variant_token, doDelete?]
const AV_MAPPING: AV_MAPPING_TYPE = [
  ['influenced-by-russian', 'ro-MD', true],
  ['moldovan', 'ro-MD', true],
  ['moldovan-accent', 'ro-MD', true],
  ['moldovan-romanian', 'ro-MD', true],
  ['с-молдавским-диалектом', 'ro-MD', true],
]

// STEP 2: Mapping for accent -> accent + variant (for Romanian regional accents)
// MAPPING: [old_accent_token, new_accent_token, variant_token, doDelete?]
const AAV_MAPPING: AAV_MAPPING_TYPE = [
  // Banat region
  ['banat', 'ro-banat', 'ro-RO', true],
  ['ro-banat', 'ro-banat', 'ro-RO', false], // already correct accent, just add variant (if not already set)
  ['timisorean', 'ro-banat', 'ro-RO', true],

  // Crișana region
  ['bihor', 'ro-crisana', 'ro-RO', true],
  ['ro-crisana', 'ro-crisana', 'ro-RO', false], // already correct accent, just add variant (if not already set)
  ['graiul-crișan', 'ro-crisana', 'ro-RO', true],

  // Maramureș region
  ['ro-maramu', 'ro-maramu', 'ro-RO', false], // already correct accent, just add variant (if not already set)

  // Moldova region (within Romania)
  ['bucovinean-romanian', 'ro-moldova', 'ro-RO', true],
  ['half-moldavian--buzau---braila-region-', 'ro-moldova', 'ro-RO', true],
  ['moldavia-accent', 'ro-moldova', 'ro-RO', true],
  ['moldavian', 'ro-moldova', 'ro-RO', true],
  ['moldovean', 'ro-moldova', 'ro-RO', true],
  ['moldovenesc', 'ro-moldova', 'ro-RO', true],
  ['moldovian', 'ro-moldova', 'ro-RO', true],
  ['romanian-moldova', 'ro-moldova', 'ro-RO', true],

  // Muntenia region (includes Bucharest and standard Romanian)
  ['accent-de-bucurești', 'ro-muntenia', 'ro-RO', true],
  ['accent-din-sud-est-romania', 'ro-muntenia', 'ro-RO', true],
  ['bucharest', 'ro-muntenia', 'ro-RO', true],
  ['bucharest-accent', 'ro-muntenia', 'ro-RO', true],
  ['bucureștean', 'ro-muntenia', 'ro-RO', true],
  ['constanta', 'ro-muntenia', 'ro-RO', true],
  ['din-bucuresti', 'ro-muntenia', 'ro-RO', true],
  ['muntean', 'ro-muntenia', 'ro-RO', true],
  ['ro-muntenia', 'ro-muntenia', 'ro-RO', false], // already correct accent, just add variant (if not already set)
  ['muntenia', 'ro-muntenia', 'ro-RO', true],
  ['native-accent-from-dobrogea', 'ro-muntenia', 'ro-RO', true],
  ['regular', 'ro-muntenia', 'ro-RO', true],
  ['romana', 'ro-muntenia', 'ro-RO', true],
  ['românia', 'ro-muntenia', 'ro-RO', true],
  ['romania-romanian', 'ro-muntenia', 'ro-RO', true],
  ['romanian', 'ro-muntenia', 'ro-RO', true],
  ['southern-muntenia', 'ro-muntenia', 'ro-RO', true],
  ['standard', 'ro-muntenia', 'ro-RO', true],
  ['standard-accent', 'ro-muntenia', 'ro-RO', true],
  ['standard-romanian', 'ro-muntenia', 'ro-RO', true],
  ['sud', 'ro-muntenia', 'ro-RO', true],
  // Generic accents (standard Romanian)
  ['native', 'ro-muntenia', 'ro-RO', true],
  ['no-accent', 'ro-muntenia', 'ro-RO', true],
  ['none', 'ro-muntenia', 'ro-RO', true],
  ['normal', 'ro-muntenia', 'ro-RO', true],
  ['neutral', 'ro-muntenia', 'ro-RO', true],
  ['good', 'ro-muntenia', 'ro-RO', true],

  // Oltenia region
  ['oltean', 'ro-oltenia', 'ro-RO', true],
  ['oltenesc', 'ro-oltenia', 'ro-RO', true],
  ['oltenian', 'ro-oltenia', 'ro-RO', true],

  // Transylvania region
  ['ardeal', 'ro-transilv', 'ro-RO', true],
  ['ardelean', 'ro-transilv', 'ro-RO', true],
  ['ro-transilv', 'ro-transilv', 'ro-RO', false], // already correct accent, just add variant (if not already set)
  ['transilvania', 'ro-transilv', 'ro-RO', true],
  ['transylvanian-romanian', 'ro-transilv', 'ro-RO', true],
]

//
// Do not change the code below unless database structure has been changed
//
export const up = async function (db: any): Promise<any> {
  // STEP 1: Migrate Moldovan accents to ro-MD variant only (no accent needed)
  await migrateAccentsToVariants_default(db, LOCALE_CODE, AV_MAPPING)

  // STEP 2: Migrate Romanian regional accents to both new accent + ro-RO variant
  await migrateAccentsToAccentsAndVariants_default(db, LOCALE_CODE, AAV_MAPPING)

  return true
}

export const down = async function (): Promise<any> {
  // We cannot take it back
  return null
}
