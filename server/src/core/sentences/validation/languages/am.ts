import { ERR_NO_ABBREVIATIONS, ERR_NO_NUMBERS, ERR_NO_SYMBOLS, ERR_OTHER, ERR_TOO_LONG, ValidatorRule } from "../../types"

const tokenizeWords = require('talisman/tokenizers/words')

// Minimum of words that qualify as a sentence.
const MIN_WORDS = 3

// Maximum of words allowed per sentence to keep recordings in a manageable duration.
const MAX_WORDS = 15

const INVALIDATIONS: ValidatorRule[] = [
  {
    'type': 'fn',
    fn: sentence => {
      const words = tokenizeWords(sentence)
      return words.length < MIN_WORDS || words.length > MAX_WORDS
    },
    error: `በአረፍተነገሩ ውስጥ ያለው የቃላት ቁጥር በ ${MIN_WORDS} እና ${MAX_WORDS} መሆን አለበት (የሚጠቃለል)`,
    errorType: ERR_TOO_LONG
  },
  {
    type: 'regex',
    regex: /[0-9]+ | [\u1369-\u137C]+/,
    error:
      'አረፍተነገሩ ውስጥ ቁጥር ሊኖር አይገባም ወይም ቁጥሩን በአማርኛ ተርጉመው ያስተካክሉት ወይም አዲስ አረፍተነገር ይጨምሩ እባክዎ።',
    errorType: ERR_NO_NUMBERS
  },
  {
    type: 'regex',
    regex: /[A-Za-z]+/,
    error: 'አረፍተነገሩ ውስጥ በእንግሊዘኛ ፊደል የተጻፈ ነገር ካለ እባክዎ ይተርጉሙት ወይም ያስወግዱት',
    errorType: ERR_OTHER
  },
  {
    type: 'regex',
    regex: /[\u1360-\u1368]+ | [<>+*#@%^[\]()/]/,
    error:
      'አረፍተነገሩ ውስጥ የተለዩ ምልክቶች እንደ ነጠላ ሰረዝ፣ ድርብ ሰረዝ፣ የዶላር ምልክት እና ሌሎችም ሊኖሩ አይገባም እባክዎ ያስተካክሉት ወይም አዲስ አረፍተነገር ይጨምሩ።',
    errorType: ERR_NO_SYMBOLS
    },
  {
    // Any words consisting of uppercase letters or uppercase letters with a period
    // in between are considered abbreviations or acronyms.
    // This currently also matches fooBAR but we most probably don't want that either
    // as users wouldn't know how to pronounce the uppercase letters.
    type: 'regex',
    regex: /[\u1200-\u1357]+\.*[\u1200-\u1357]+/,
    error: 'አረፍተነገሩ ውስጥ ምህጻረ ቃላት ካሉ ያስወግዱት እባክዎ',
    errorType: ERR_NO_ABBREVIATIONS
  },
]

export default INVALIDATIONS
