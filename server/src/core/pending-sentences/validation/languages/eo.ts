import { ValidatorRule } from '../../types'

const tokenizeWords = require('talisman/tokenizers/words')

// Minimum of words that qualify as a sentence.
const MIN_WORDS = 1

// Maximum of words allowed per sentence to keep recordings in a manageable duration.
const MAX_WORDS = 14

const INVALIDATIONS: ValidatorRule[] = [
  {
    type: 'fn',
    fn: (sentence: string) => {
      const words = tokenizeWords(sentence)
      return words.length < MIN_WORDS || words.length > MAX_WORDS
    },
    error: `Frazo devas havi minimume ${MIN_WORDS} kaj maksimume ${MAX_WORDS} vortojn`,
  },
  {
    // Sentence should not contain numbers
    type: 'regex',
    regex: /[0-9]+/,
    error: 'Frazo devas ne enhavi numerojn',
  },
  {
    // Sentence should not contain symbols
    type: 'regex',
    regex: /[<>+*#@^[\]()/]/,
    error: 'Frazo devas ne enhavi specialajn signojn',
  },
  {
    // Sentence should not contain the letters W, Q, X, Y, or other letters that are not in the Esperanto alphabet
    type: 'regex',
    regex: /[qQwWxXyYÀ-ćĊ-ěĞ-ģĞ-ģĦ-ĳĶ-śŞ-ūŮ-ʯḀ-ỿα-ωΑ-ΩЀ-ӿ]/,
    error:
      'Frazo devas ne enhavi la literojn W, Q, X, Y, aŭ aliajn ne-esperantajn literojn',
  },
  {
    // Any words consisting of uppercase letters or uppercase letters with a period
    // inbetween are considered abbreviations or acronyms.
    // This currently also matches fooBAR but we most probably don't want that either
    // as users wouldn't know how to pronounce the uppercase letters.
    type: 'regex',
    regex: /[A-Z]{2,}|[A-Z]+\.*[A-Z]+/,
    error: 'Frazo devas ne enhavi mallongigojn',
  },
]

export default INVALIDATIONS
