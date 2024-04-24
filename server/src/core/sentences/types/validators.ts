const ValidatorLocales = [
  'am',
  'bas',
  'ca',
  'ckb',
  'en',
  'eo',
  'he',
  'ig',
  'it',
  'kab',
  'ko',
  'lo',
  'ne-NP',
  'or',
  'ru',
  'th',
  'tok',
  'ur',
  'uz',
  'yue',
  'default_locale',
] as const

export const ERR_TOO_LONG = 'TOO_LONG' as const
export const ERR_NO_NUMBERS = 'NO_NUMBERS' as const
export const ERR_NO_SYMBOLS = 'NO_SYMBOLS' as const
export const ERR_NO_ABBREVIATIONS = 'NO_ABBREVIATIONS' as const
export const ERR_NO_FOREIGN_SCRIPT = 'NO_FOREIGN_SCRIPT' as const
export const ERR_OTHER = 'OTHER' as const

export const ERROR_TYPES = [
  ERR_TOO_LONG,
  ERR_NO_NUMBERS,
  ERR_NO_SYMBOLS,
  ERR_NO_ABBREVIATIONS,
  ERR_NO_FOREIGN_SCRIPT,
  ERR_OTHER,
] as const

export type ValidatorLocale = typeof ValidatorLocales[number]
export type ValidatorRuleErrorType = typeof ERROR_TYPES[number]

export type ValidatorRuleError = {
  error: string
  errorType: ValidatorRuleErrorType
}

export const isValidatorLocale = (locale: string): locale is ValidatorLocale =>
  ValidatorLocales.includes(locale as ValidatorLocale)

export type ValidatorLocaleIdMapping = Record<number, ValidatorLocale>

export type ValidatorRule = ValidatorRuleFunction | ValidatorRuleRegEx

export type ValidatorRuleFunction = ValidatorRuleError & {
  type: 'fn'
  fn: (s: string) => boolean
}

export type ValidatorRuleRegEx = ValidatorRuleError & {
  type: 'regex'
  regex: RegExp
}

export type Validators = Record<ValidatorLocale, ValidatorRule[]>
