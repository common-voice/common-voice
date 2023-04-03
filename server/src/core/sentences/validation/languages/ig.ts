import {
  ERR_NO_ABBREVIATIONS,
  ERR_NO_NUMBERS,
  ERR_NO_SYMBOLS,
  ERR_TOO_LONG,
  ValidatorRule,
} from '../../types/validators'

const tokenizeWords = require('talisman/tokenizers/words')

// Minimum of words that qualify as a sentence.
const MIN_WORDS = 1

// Maximum of words allowed per sentence to keep recordings in a manageable duration.
const MAX_WORDS = 16

const INVALIDATIONS: ValidatorRule[] = [
  {
    type: 'fn',
    fn: (sentence: string) => {
      const words = tokenizeWords(sentence)
      return words.length < MIN_WORDS || words.length > MAX_WORDS
    },
    error: `Number of words must be between ${MIN_WORDS} and ${MAX_WORDS} (inclusive)`,
    errorType: ERR_TOO_LONG,
  },
  {
    type: 'regex',
    regex: /[0-9]+/,
    error: 'Sentence should not contain numbers',
    errorType: ERR_NO_NUMBERS,
  },
  {
    type: 'regex',
    regex: /[<>+*#@^[\]()/]/,
    error: 'Sentence should not contain symbols',
    errorType: ERR_NO_SYMBOLS,
  },
  {
    // Any words consisting of uppercase letters or uppercase letters with a period
    // inbetween are considered abbreviations or acronyms.
    // This currently also matches fooBAR but we most probably don't want that either
    // as users wouldn't know how to pronounce the uppercase letters.
    type: 'regex',
    regex: /[A-Z]{2,}|[A-Z]+\.*[A-Z]+/,
    error: 'Sentence should not contain abbreviations',
    errorType: ERR_NO_ABBREVIATIONS,
  },
]

export default INVALIDATIONS
