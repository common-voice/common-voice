const ValidatorLocales = [
  'am',
  'bas',
  'ca',
  'ckb',
  'en',
  'eo',
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

export type ValidatorLocale = typeof ValidatorLocales[number]

export const isValidatorLocale = (locale: string): locale is ValidatorLocale =>
  ValidatorLocales.includes(locale as ValidatorLocale)

export type ValidatorLocaleIdMapping = Record<number, ValidatorLocale>

export type ValidatorRule = ValidatorRuleFunction | ValidatorRuleRegEx

export type ValidatorRuleFunction = {
  type: 'fn'
  fn: (s: string) => boolean
  error: string
}

export type ValidatorRuleRegEx = {
  type: 'regex'
  regex: RegExp
  error: string
}

export type Validators = Record<ValidatorLocale, ValidatorRule[]>
