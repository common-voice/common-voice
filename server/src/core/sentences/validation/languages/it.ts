import {
  ERR_NO_ABBREVIATIONS,
  ERR_NO_NUMBERS,
  ERR_NO_SYMBOLS,
  ERR_OTHER,
  ERR_TOO_LONG,
  ValidatorRule,
} from '../../types'

// According to Mozilla Italia guidelines, we count chars to validate instead of words.
const MIN_LENGTH = 1
const MAX_LENGTH = 125

const INVALIDATIONS: ValidatorRule[] = [
  {
    type: 'fn',
    fn: (sentence: string) => {
      return sentence.length < MIN_LENGTH || sentence.length > MAX_LENGTH
    },
    error: `Number of characters must be between ${MIN_LENGTH} and ${MAX_LENGTH} (inclusive)`,
    errorType: ERR_TOO_LONG,
  },
  {
    type: 'regex',
    regex: /[0-9]+/,
    error: 'Sentence should not contain numbers',
    errorType: ERR_NO_NUMBERS,
  },
  {
    // This could mean multiple sentences per line.
    type: 'regex',
    regex: /[?!.].+/,
    error: 'Sentence should not contain sentence punctuation inside a sentence',
    errorType: ERR_OTHER,
  },
  {
    // Italian: Simboli non permessi, aggiungere anche qui sotto oltre che nella regex:
    // < > + * \ # @ ^ “ ” ‘ ’ ( ) É [ ] / { }
    // doppio " " e più di un "." nella stessa frase.
    type: 'regex',
    regex: /[<>+*\\#@^“”‘’(){}É[\]/]|\s{2,}|!{2,}/,
    error:
      'Sentence should not contain symbols or multiple spaces/exclamation marks',
    errorType: ERR_NO_SYMBOLS,
  },
  {
    // Any words consisting of uppercase letters or uppercase letters with a period
    // inbetween are considered abbreviations or acronyms.
    // This currently also matches fooBAR but we most probably don't want that either
    // as users wouldn't know how to pronounce the uppercase letters.
    // Versione italiana: dag7dev
    type: 'regex',
    regex: /[A-Z]{2,}|[A-Z][a-z]+\.*[A-Z]+/,
    error: 'Sentence should not contain abbreviations',
    errorType: ERR_NO_ABBREVIATIONS,
  },
]

export default INVALIDATIONS
