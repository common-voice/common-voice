import {
  ERR_NO_FOREIGN_SCRIPT,
  ERR_OTHER,
  ERR_TOO_LONG,
  ValidatorRule,
} from '../../types'

// Minimum of characters that qualify as a sentence.
const MIN_CHARACTERS = 1

// Maximum of characters allowed per sentence to keep recordings in a manageable duration.
const MAX_CHARACTERS = 50

const INVALIDATIONS: ValidatorRule[] = [
  {
    type: 'fn',
    fn: (sentence: string) => {
      // To properly tokenize Korean, We need some heavy tokenizers (ex: mecab-ko, nori, ...),
      // For counting letters those tokenizers are not necessary.
      return (
        sentence.length < MIN_CHARACTERS || sentence.length > MAX_CHARACTERS
      )
    },
    error: `문장의 글자 수는 ${MIN_CHARACTERS}글자 이상, ${MAX_CHARACTERS}글자 이하여야 합니다.`,
    errorType: ERR_TOO_LONG,
  },
  {
    // One Korean letter is composed with two or three letters,
    // in order of (consonant(1st) - vowel(2nd) - consonant(3rd, optional)).
    // It shouldn't be allowed to use them separately, since that could cause various pronunciation issues.
    //
    // This regex is for Unicode "Hangul Syllables" (U+AC00–U+D7A3), Which are composed form (see below).
    type: 'regex',
    regex: /[ㄱ-ㅎㅏ-ㅣ]/,
    error: '문장에는 자음이나 모음만 따로 있는 글자가 있어서는 안 됩니다.',
    errorType: ERR_OTHER,
  },
  {
    // Korean letters (Hangul) have two type of Unicode code points.
    //
    // - Composed form (Unicode "Hangul Syllables" : U+AC00–U+D7A3)
    //   - One Unicode codepoint contains three or two letters in rectangular shape.
    //   - This is normally used codepoints.
    // - Other forms
    //   - Other Unicode codepoints deal korean letters as separated vowels and consonants.
    //   - This takes doubled space in bytes.
    //   - This only appears when a contributor is using keyboard layout called "Sebeolsik", which is akin to Dvorak.
    //   - After NFC normalization ( 5a86a81 ),
    //     Composible combination of two or three characters (1st - 2nd - 3rd (optional)) will become
    //     Composed form ("Hangul Syllables"). Characters that cannot be combined may remain.
    //
    // This regex is for codepoints other than "Hangul Syllables" (U+AC00–U+D7A3).
    type: 'regex',
    regex: /[\u1100-\u11FF\uA960-\uA97F\u3130-\u318F]/u,
    error:
      '문장에는 첫가끝 형태의 분해된 글자가 있어서는 안 됩니다. 완성형 글자를 입력해주세요.',
    errorType: ERR_OTHER,
  },
  {
    // Since there are so may kinds of "should not be allowed" letters,
    // It would be convenient to allow only certain type of characters.
    // examples: CJK chinese letters, Japanese letters, Korean specific chinese letters (aka hanja),
    //           not-used symbols (semicolon, colon - native korean sentences do not contain them),
    //           better to be excluded symbols (quote, tilda, ...),
    //           characters that can be normalized into normal characters with destructive NFKC normalization (ⓐ, ㈜, ...),
    //           historical korean letters (aka 옛한글 - ㆆ, ㅿ, ㆁ, ...)
    //           ...
    type: 'regex',
    regex: /[^가-힣.,?! ]/u,
    error:
      '문장에는 한글과 마침표, 쉼표, 느낌표, 물음표, 공백만 들어있어야 합니다.',
    errorType: ERR_NO_FOREIGN_SCRIPT,
  },
]

export default INVALIDATIONS
