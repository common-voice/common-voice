import {
  ERR_NO_ABBREVIATIONS,
  ERR_NO_FOREIGN_SCRIPT,
  ERR_NO_SYMBOLS,
  ERR_TOO_LONG,
  validateSentence,
  ValidatorRuleError,
  ValidatorRuleErrorType,
} from '../../../../core/sentences'
import * as E from 'fp-ts/Either'

describe('Sentence validation', () => {

  const shouldAcceptSentence = ({lang, sentence}: {lang: string, sentence: string}) => {
    const result = validateSentence(lang)(sentence)
    expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(sentence)
  }

  const shouldRejectSentence = ({lang, sentence, expectedErrorType}: {lang: string, sentence: string, expectedErrorType: ValidatorRuleErrorType}) => {
    const result = validateSentence(lang)(sentence)
    expect(E.getOrElse((err: ValidatorRuleError) => err.errorType.toString())(result)).toBe(
      expectedErrorType.toString()
    )
  }

  it('Should validate english sentence with no errors', () => {
    const result = validateSentence('en')('This is a simple question.')
    expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(
      'This is a simple question.'
    )
  })

  it('Should validate sentence with locale not in list', () => {
    const result = validateSentence('abc')('This is a simple question.')
    expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(
      'This is a simple question.'
    )
  })

  it('Should invalidate sentence with too many words', () => {
    const result = validateSentence('en')(
      'This is very very very very very very very very very very very very very very very very very very very very long'
    )
    expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(
      'Number of words must be between 1 and 14 (inclusive)'
    )
  })

  it('Should invalidate sentence that contains numbers', () => {
    const result = validateSentence('en')('This is 2valid')
    expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(
      'Sentence should not contain numbers'
    )
  })

  it('Should invalidate sentence that contains abbreviations', () => {
    const result = validateSentence('en')('This is the A.B.C company')
    expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(
      'Sentence should not contain abbreviations'
    )
  })

  const wrongSymbolDataProvider = [
    {
      sentence: 'This is @ test',
      error: 'Sentence should not contain symbols',
      symbol: '@',
    },
    {
      sentence: 'This is # test',
      error: 'Sentence should not contain symbols',
      symbol: '#',
    },
    {
      sentence: 'This is / test',
      error: 'Sentence should not contain symbols',
      symbol: '/',
    },
  ]

  it.each(wrongSymbolDataProvider)(
    'Should invalidate sentence that contains the symbol $symbol',
    ({ sentence, error }) => {
      const result = validateSentence('en')(sentence)
      expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(
        error
      )
    }
  )

  it('Should invalidate sentence that contains more than one sentence', () => {
    const result = validateSentence('it')('This is one test. Here is one more.')
    expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(
      'Sentence should not contain sentence punctuation inside a sentence'
    )
  })

  it('Should invalidate sentence that contains wrong alphabet', () => {
    const result = validateSentence('ru')('This is a test')
    expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(
      'Sentence should not contain latin alphabet characters'
    )
  })

  const wrongEndDataProvider = [
    {
      sentence: 'This is wrong .',
      error: 'Sentence should not end with a space and a period',
      ending: 'space and period',
    },
    {
      sentence: 'This as well!.',
      error: 'Sentence should not end with a exclamation mark and a period',
      ending: 'exclamation mark and period',
    },
    {
      sentence: 'No;',
      error: 'Sentence should not end with a semicolon',
      ending: 'semicolon',
    },
    {
      sentence: 'Definitely not,',
      error: 'Sentence should not end with a comma',
      ending: 'comma',
    },
  ]

  it.each(wrongEndDataProvider)(
    'Should invalidate sentence that ends with a $ending',
    ({ sentence, error }) => {
      const result = validateSentence('bas')(sentence)
      expect(E.getOrElse((err: ValidatorRuleError) => err.error)(result)).toBe(
        error
      )
    }
  )

  it('Should normalize sentence for the "ko" locale', () => {
    const result = validateSentence('ko')('콜')
    expect(
      E.getOrElse((err: ValidatorRuleError) => err.error)(result) === '콜'
    ).toBeFalsy()
  })
  
  it('Should validate Amharic sentence with no errors', () => {
    const sentence = 'ሴኮባ ኮናቴ ጊኒ ውስጥ የሚገኝ ጁንታ ጊዜያዊ መሪ በመታመሙ ወደ ሴኔጋል ተወሰደ'
    const result = validateSentence('am')(sentence)
    expect(
      E.getOrElse((err: ValidatorRuleError) => err.error)(result)
    ).toBe(sentence)
  })

  it.each([
    'זהו משפט תקין בעברית',
    'בעקרון, לא אמורה להיות בעיה עם סימני פיסוק!',
    'גם נִיקוד הולך',
  ])(
    'Should validate Hebrew sentences with no errors',
    (sentence) => shouldAcceptSentence({lang: 'he', sentence})
  )

  it(
    'Should invalidate overly long Hebrew sentence',
    () => shouldRejectSentence({
      lang: 'he',
      sentence: 'שמאי אומר, עשה תורתך קבע. אמור מעט ועשה הרבה. והוי מקבל את כל האדם בסבר פנים יפות.',
      expectedErrorType: ERR_TOO_LONG
    })
  )

  it(
    'Should invalidate Hebrew sentence with cantillation marks',
    () => shouldRejectSentence({lang: 'he', sentence: 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ', expectedErrorType: ERR_NO_SYMBOLS})
  )

  it(
    'Should invalidate Hebrew sentence with invalid symbols that are also invalid for English',
    () => shouldRejectSentence({lang: 'he', sentence: 'הסימון כרוכית @ משמש לעיתים בדוא"ל', expectedErrorType: ERR_NO_SYMBOLS})
  )

  it(
    'Should invalidate Hebrew sentence with invalid symbols that are not invalid for English',
    () => shouldRejectSentence({lang: 'he', sentence: 'הסימן שווה = משמש גם כיחס שקילות', expectedErrorType: ERR_NO_SYMBOLS})
  )

  it(
    'Should invalidate Hebrew sentence with non-Hebrew letters',
    () => shouldRejectSentence({lang: 'he', sentence: 'לפעמים בעברית אומרים okay למרות שזו מילה באנגלית', expectedErrorType: ERR_NO_FOREIGN_SCRIPT})
  )

  it.each([
    'כל הכבוד לצה"ל',
    'לאונרד כהן ז"ל היה משורר דגול',
    "אמר ר' משה בן מימון",
    "לפעמים פשוט בא לי לקצר וכו'",
    "יש מי שמקצר וכו' ויש מי שכותב וכולי",
    "א. ב. יהושע נפטר בשנה שעברה",
  ])(
    'Should invalidate Hebrew sentence with abbreviations',
    (sentence) => shouldRejectSentence({lang: 'he', sentence: sentence, expectedErrorType: ERR_NO_ABBREVIATIONS})
  )

})
