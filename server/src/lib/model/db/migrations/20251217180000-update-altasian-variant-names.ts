// TEMPLATE MIGRATION FOR VARIANT NAME CHANGE
// Changes variant name(s) for a specific locale and given variant codes
// IMPORTANT: One must also change them in server/src/lib/model/db/language-data/variants.ts
// Otherwise the original names will re-appear on next server start.
// This one is for Alsatian (gsw)

const LOCALE_CODE = 'gsw'

// Mapping of old variant names to new variant names
// Trying to be specific to avoid accidental changes
// [variant_token, oldVariantName, newVariantName]
const MAPPING = [
  [
    'gsw-FR-rhinfran',
    'Rhinfränkisch (Bùckenùmm, Lìtzelstän, usw.)',
    'Rhinfränkisch (Bùckenùmm, Lìtzelstän, Bitsch, Saargemìnn usw.)',
  ],
  [
    'gsw-FR-nordalem',
    'Nordniederàlemmànisch (Rishoffe, Zàwere, Bùsswìller, Hawenau, Brüemt, Stroossbùri, Molse, Dàmbàch, Schlettstàtt, usw.)',
    'Nordniederàlemmànisch (Rishoffe, Zàwere, Bùsswìller, Hawenau, Brüemt, Stroossbùri, Molse, Dàmbàch, Schlettstàtt, Pfàlzbùri usw.)',
  ],
]

//
// Do not change the code below unless database structure has been changed
//
import {
  findLocaleIdFromLocaleCode,
  changeVariantName,
} from '../migration-helpers/'

export const up = async function (db: any): Promise<any> {
  // Have some data ready
  const localeId = await findLocaleIdFromLocaleCode(db, LOCALE_CODE)

  if (!localeId) {
    console.warn(`Locale not found: [${LOCALE_CODE}]`)
    return null
  }

  // Process in loop
  MAPPING.forEach(async ([variantToken, oldName, newName]) => {
    await changeVariantName(db, localeId, variantToken, oldName, newName)
  })
}

export const down = async function (db: any): Promise<null> {
  // Have some data ready
  const localeId = await findLocaleIdFromLocaleCode(db, LOCALE_CODE)

  if (!localeId) {
    console.warn(`Locale not found: [${LOCALE_CODE}]`)
    return null
  }

  // Process in loop (swapped names)
  MAPPING.forEach(async ([variantToken, oldName, newName]) => {
    await changeVariantName(db, localeId, variantToken, newName, oldName)
  })
}
