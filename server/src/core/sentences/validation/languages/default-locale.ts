import {
  ERR_NO_ABBREVIATIONS,
  ERR_NO_NUMBERS,
  ERR_NO_SYMBOLS,
  ERR_TOO_LONG,
  ValidatorRule,
} from '../../types/validators'

const tokenizeWords = require('talisman/tokenizers/words')

const TRANSLATION_KEY_PREFIX = 'TRANSLATION_KEY:'

// Minimum of words that qualify as a sentence.
const MIN_WORDS = 1

// Maximum of words allowed per sentence to keep recordings in a manageable duration.
const MAX_WORDS = 14

const INVALIDATIONS: ValidatorRule[] = [
  {
    type: 'fn',
    fn: (sentence: string): boolean => {
      const words = tokenizeWords(sentence)
      return words.length < MIN_WORDS || words.length > MAX_WORDS
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
