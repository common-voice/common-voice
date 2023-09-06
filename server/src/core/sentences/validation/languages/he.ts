import {
  ERR_NO_ABBREVIATIONS,
  ERR_NO_NUMBERS,
  ERR_NO_FOREIGN_SCRIPT,
  ERR_TOO_LONG,
  ValidatorRule,
  ERR_NO_SYMBOLS,
} from '../../types/validators'

const tokenizeWords = require('talisman/tokenizers/words')

// Minimum of words that qualify as a sentence.
const MIN_WORDS = 1

// Maximum of words allowed per sentence to keep recordings short enough.
const MAX_WORDS = 14

// We want to create a pattern that rejects everything except what is allowed.
// Here we specify only valid character classes, i.e. these will be placed in
// `[^...]`.
const VALID_CHAR_CLASSES = {
  // In the Basic Latin block, everything that's displayable minus
  // latin letters gives us the following range:
  //    [\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]
  //
  // Some of this contains symbols and punctuations that shouldn't appear in
  // real sentences. The English validator excludes the symbols
  //   [<>+*#@%^[\]()/] (or [\x23\x25\x28\x29\x2a\x2b\x2f\x3c\x3e\x40\x5b\x5d\x5e])
  //
  // However there are some more symbols we don't want -
  // these are
  //   [$&=\\_] (or [\x24\x26\x3d\x5c\x5f])
  // See below for INVALID_CHAR_CLASSES.
  //
  // This leaves us with the following valid punctuation:
  punctuation: "- !\"',.:;?`",  // or [\x20-\x22\x27\x2c-\x2e\x3a\x3b\x3f\x60]

  // Finally, we want the Hebrew text. This includes the letters themselves
  // and the niqqud symbols (diacritical signs used to represent vowels).
  // Note that we deliberately omit Hebrew cantiallation symbols (trope), as
  // these are seen in Biblical Hebrew - and we don't want users to submit
  // these (in fact, this was the motivator for writing this validator).
  // See the [Hebrew Unicode block](http://www.unicode.org/charts/nameslist/n_0590.html).
  hebrewLetters: "א-ת",  // or [\u05d0-\u05ea], or [אבגדהוזחטיךכלםמןנסעףפץצקרשת]
  hebrewNiqqud: "\u05b0-\u05bc\u05be\u05c1\u05c2\u05c7\u05f3\u05f4",

  // Unicode includes some other fancy punctuation symbols that might occur in
  // user-submitted text (e.g. fancy quotes that are added by some eager word
  // processors) and might be difficult for the user to spot (which
  // would frustrate them). Taking a cue from the allowable Basic Latic
  // punctuation symbols, we include:
  dashes: "\u2010-\u2015\ufe58\ufe63",  // or [‐‑‒–—―﹘﹣]
  combinedPunctuation: "\u2047-\u2049\u2026",  // or [⁇⁈⁉…]
  quotation: "\u2018-\u201f\u2039\u203a\u2e42\u301d\u00bb\u00ab",  // or [‘’‚‛“”„‟‹›⹂〝»«]
  // eslint-disable-next-line no-irregular-whitespace
  whitespace: "\\p{Zs}",  // or [\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000], or [                　]
  // See also:
  //   - [Category `Zs`](https://www.compart.com/en/unicode/category/Zs)
  //   - [Category `Pd`](https://www.compart.com/en/unicode/category/Pd)
  //   - [Category `Po`](https://www.compart.com/en/unicode/category/Po)
  //   - [Category `Pi`](https://www.compart.com/en/unicode/category/Pi)
  //   - [Category `Pf`](https://www.compart.com/en/unicode/category/Pf)
  // Note: There was some careful manual work in selecting the symbols above.
  // Some small punctuation marks (`\ufe50-\ufe55`) were excluded as we
  // don't expect them to appear in any text. Also we didn't include some
  // categories (e.g. `Pi`, `Pf` or `Pd`) in their entirety as they contain
  // invalid punctuation alongside valid punctuation.
};
const INVALID_CHAR_CLASSES = {
  // We check for these marks separately to give an appropriate error message
  hebrewCantillation: "\u0591-\u05af\u05bd\u05bf\u05c0\u05c3-\u05c6\u05ef-\u05f2",
  invalidPunctuation: "<>+*#@%^[\\]()/",  // or [\x23\x25\x28\x29\x2a\x2b\x2f\x3c\x3e\x40\x5b\x5d\x5e]
  // Note: "\\\\" is specified explicity in place of \x5c
  extraInvalidPunctuationValidInEn: "$&=_\\\\",  // or [\x24\x26\x3d\x5f\\\\]
}

// Note that because the Hebrew niqqud symbols modify the preceding character,
// eslint doesn't like that we list them in a character class range. Since we
// intend to allow them wherever (we're not picky), we just shush eslint.
// The alternative would be to use the `v` flag (unicodeSets) and to quote
// (using `\q{}`) each niqqud character.
// eslint-disable-next-line no-misleading-character-class
const INVALID_STRICT_REGEX = new RegExp("[^" +
  VALID_CHAR_CLASSES.punctuation +
  VALID_CHAR_CLASSES.hebrewNiqqud +
  VALID_CHAR_CLASSES.hebrewLetters +
  VALID_CHAR_CLASSES.whitespace +
  VALID_CHAR_CLASSES.dashes +
  VALID_CHAR_CLASSES.quotation +
  VALID_CHAR_CLASSES.combinedPunctuation +
  "]", "u");

// Same reason as above for disabling linting, because of Hebrew cantillation
// marks this time.
// eslint-disable-next-line no-misleading-character-class
const INVALID_SYMBOLS_REGEX = new RegExp("[" +
  INVALID_CHAR_CLASSES.invalidPunctuation +
  INVALID_CHAR_CLASSES.extraInvalidPunctuationValidInEn +
  INVALID_CHAR_CLASSES.hebrewCantillation +
  "]", "u")

const INVALIDATIONS: ValidatorRule[] = [
  {
    type: 'regex',
    regex: /[0-9]+/,
    // Original string:
    // error: 'Sentence should not contain numbers',
    // Literally translated as:
    // error: 'Sentence should not contain numbers - if need be, you can write the number in words',
    error: 'אין להכליל מספרים במשפט - במקרה הצורך ניתן לכתוב את המספר במילים',
    errorType: ERR_NO_NUMBERS,
  },
  {
    type: 'regex',
    // Original string:
    // error: 'Sentence should not contain symbols',
    // Literally translated as:
    // error: 'The sentence should contain non-readable symbols or cantillation marks',
    regex: INVALID_SYMBOLS_REGEX,
    error: 'אין להכליל סימנים שלא ברור כיצד לקרוא אותם או טעמי מקרא',
    errorType: ERR_NO_SYMBOLS,
  },
  {
    type: 'regex',
    // Original string:
    // error: 'Sentence should not contain symbols',
    // Literally translated as:
    // error: 'The sentence should include only Hebrew letters and punctuation - no other symbols or letters from other languages should be included',
    regex: INVALID_STRICT_REGEX,
    error: 'על המשפט להכיל רק אותיות בעברית וסימני פיסוק - אין להכליל סימנים אחרים או אותיות משפות אחרות',
    // Note: this is a combination of ERR_NO_SYMBOLS and ERR_NO_FOREIGN_SCRIPT
    errorType: ERR_NO_FOREIGN_SCRIPT,
  },
  {
    type: 'regex',
    // Any word in the pattern X⋯X"X, X.X.⋯ or XX?' (where X is a Hebrew letter)
    // is considered an abbreviation or acronym. This forces the user to place
    // spaces around quotes where they are not intended as abbreviation markers.
    regex: /(?:[א-ת][.] ?){2,}|(?:^| )(?:[א-ת][.])|(?:[א-ת]+["][א-ת])|[א-ת]{1,2}'(?: |$)/,
    // Original string:
    // error: 'Sentence should not contain abbreviations',
    // Literally translated as:
    // error: 'Do not include initials or abbreviations in the sentence, and make sure there is a space between a punctuation mark and the succeeding word',
    error: 'אין להכליל ראשי-תיבות או קיצורים במשפט, ויש לוודא כי קיים רווח בין סימן פיסוק למילה המופיעה אחריו',
    errorType: ERR_NO_ABBREVIATIONS,
  },
  {
    type: 'fn',
    fn: (sentence: string) => {
      const words = tokenizeWords(sentence)
      return (words.length < MIN_WORDS) || (words.length > MAX_WORDS)
    },
    // Original string:
    // error: `Number of words must be between ${MIN_WORDS} and ${MAX_WORDS} (inclusive)`,
    // Literally translated as:
    // error: `The sentence should contain at least ${MIN_WORDS} words and at most ${MAX_WORDS} words`,
    error: `על המשפט להכיל לפחות ${MIN_WORDS} מילים ולכל היותר ${MAX_WORDS} מילים`,
    errorType: ERR_TOO_LONG,
  },
]

export default INVALIDATIONS
