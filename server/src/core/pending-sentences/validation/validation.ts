import default_locale from './languages/default-locale'
import am from './languages/am'
import bas from './languages/bas'
import ca from './languages/ca'
import ckb from './languages/ckb'
import en from './languages/en'
import eo from './languages/eo'
import ig from './languages/ig'
import it from './languages/it'
import kab from './languages/kab'
import ko from './languages/ko'
import lo from './languages/lo'
import neNp from './languages/ne-NP'
import or from './languages/or'
import ru from './languages/ru'
import th from './languages/th'
import tok from './languages/tok'
import ur from './languages/ur'
import uz from './languages/uz'
import yue from './languages/yue'

import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'

import { Validators } from '..'
import { isValidatorLocale, ValidatorLocale, ValidatorRule } from '../types'

const VALIDATORS: Validators = {
  am,
  bas,
  ca,
  ckb,
  en,
  eo,
  ig,
  it,
  kab,
  ko,
  lo,
  'ne-NP': neNp,
  or,
  ru,
  th,
  tok,
  ur,
  uz,
  yue,
  default_locale,
}

// For certain language we want to normalize before we validate.
// This then also means that the returned sentence is normalized
// and therefore will be saved to the database in normalized form.
const USE_NFC_NORMALIZATION = ['ko']

const getValidatorFor = (locale: ValidatorLocale | string): ValidatorRule[] =>
  isValidatorLocale(locale) ? VALIDATORS[locale] : default_locale

const runValidatorOnSentence =
  (rules: ValidatorRule[]) =>
  (sentence: string): E.Either<string, string> => {
    for (const rule of rules) {
      switch (rule.type) {
        case 'fn':
          if (rule.fn(sentence)) return E.left(rule.error)
          else continue
        case 'regex':
          if (sentence.match(rule.regex)) return E.left(rule.error)
          else continue
      }
    }
    return E.right(sentence)
  }

const normalize = (sentence: string) => sentence.normalize('NFC')

const normalizeForLocale = (locale: string) => (sentence: string) =>
  USE_NFC_NORMALIZATION.includes(locale) ? normalize(sentence) : sentence

const validateSentenceForLocale = flow(getValidatorFor, runValidatorOnSentence)

export const validateSentence = (locale: string) => (sentence: string) => {
  return pipe(
    sentence,
    normalizeForLocale(locale),
    validateSentenceForLocale(locale)
  )
}
