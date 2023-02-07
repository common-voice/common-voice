export type ValidatorLocale = 
  | 'bas'
  | 'ca'
  | 'ckb'
  | 'en'
  | 'eo'
  | 'ig'
  | 'it'
  | 'kab'
  | 'ko'
  | 'lo'
  | 'ne'
  | 'or'
  | 'ru'
  | 'th'
  | 'tok'
  | 'ur'
  | 'uz'
  | 'yue'

export type ValidatorRule = ValidatorRuleFunction | ValidatorRuleRegEx

export type ValidatorRuleFunction = {
  type: 'fn';
  fn: (s: string) => boolean;
  error: string;
}

export type ValidatorRuleRegEx = {
  type: 'regex';
  regex: RegExp;
  error: string;
}

export type Validators = Record<ValidatorLocale, ValidatorRule[]>


