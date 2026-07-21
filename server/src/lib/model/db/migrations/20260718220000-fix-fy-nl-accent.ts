/* eslint-disable @typescript-eslint/no-explicit-any */
// Inserts predefined Frisian accents for fy-NL.
// Uses insertNewAccents() — the standard method for adding predefined accents going forward.
//
// For each accent: if a user-submitted accent with the same name is blocking insertion
// (UNIQUE KEY on locale_id, accent_name), those users are migrated to the new predefined
// accent and the old one is removed. Each accent is handled in its own transaction —
// errors are caught per-accent, rolled back, and the next one continues.
//
import { insertNewAccents, NEW_ACCENT_TYPE } from '../migration-helpers/'

const LOCALE_CODE = 'fy-NL'

const NEW_ACCENTS: NEW_ACCENT_TYPE = [
  ['fy-clayfr', 'Klaaifrysk'],
  ['fy-woodfr', 'Wâldfrysk'],
  ['fy-south-southwest', 'Súdwesthoeksk'],
  ['fy-north', 'Noardhoeksk'],
]

export const up = async function (db: any): Promise<void> {
  await insertNewAccents(db, LOCALE_CODE, NEW_ACCENTS)
}

export const down = async function (): Promise<null> {
  // Cannot be safely rolled back
  console.warn('This migration cannot be safely rolled back')
  return null
}
