import {
  ERR_NO_ABBREVIATIONS,
  ERR_NO_NUMBERS,
  ERR_NO_SYMBOLS,
  ERR_TOO_LONG,
  ValidatorRule,
} from '../../types/validators'

const TRANSLATION_KEY_PREFIX = 'TRANSLATION_KEY:'

const MIN_CHARS = 1

const MAX_CHARS = 120

const INVALIDATIONS: ValidatorRule[] = [
  {
    type: 'fn',
    fn: (sentence: string): boolean => {
      return sentence.length < MIN_CHARS || sentence.length > MAX_CHARS
    },
    error: `${TRANSLATION_KEY_PREFIX}sc-validation-number-of-words`,
    errorType: ERR_TOO_LONG,
  },
  {
    type: 'regex',
    regex: /[0-9]+/,
    error: `${TRANSLATION_KEY_PREFIX}sc-validation-no-numbers`,
    errorType: ERR_NO_NUMBERS,
  },
  {
    type: 'regex',
    regex: /[<>+*#@%^[\]()/]/,
    error: `${TRANSLATION_KEY_PREFIX}sc-validation-no-symbols`,
    errorType: ERR_NO_SYMBOLS,
  },
  {
    // Any words consisting of uppercase letters or uppercase letters with a period
    // in-between are considered abbreviations or acronyms.
    // This currently also matches fooBAR but we most probably don't want that either
    // as users wouldn't know how to pronounce the uppercase letters.
    type: 'regex',
    regex: /[A-Z]{2,}|[A-Z]+\.*[A-Z]+/,
    error: `${TRANSLATION_KEY_PREFIX}sc-validation-no-abbreviations`,
    errorType: ERR_NO_ABBREVIATIONS,
  },
]

export default INVALIDATIONS
