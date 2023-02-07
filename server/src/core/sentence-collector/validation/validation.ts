import default_locale from './languages/default-locale';
import bas from './languages/bas';
import ca from './languages/ca';
import ckb from './languages/ckb';
import en from './languages/en';
import eo from './languages/eo';
import ig from './languages/ig';
import it from './languages/it';
import kab from './languages/kab';
import ko from './languages/ko';
import lo from './languages/lo';
import ne from './languages/ne';
import or from './languages/or';
import ru from './languages/ru';
import th from './languages/th';
import tok from './languages/tok';
import ur from './languages/ur';
import uz from './languages/uz';
import yue from './languages/yue';

import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';

import { Validators } from '../../sentence-collector';
import { ValidatorLocale, ValidatorRule } from '../types';

const VALIDATORS: Validators = {
  bas,
  ca,
  ckb,
  en,
  eo,
  ig,
  it,
  kab,
  ko,
  lo,
  ne,
  or,
  ru,
  th,
  tok,
  ur,
  uz,
  yue,
};

// For certain language we want to normalize before we validate.
// This then also means that the returned sentence is normalized
// and therefore will be saved to the database in normalized form.
const USE_NFC_NORMALIZATION = ['ko'];

// export function validateSentences(language: ValidatorLocale, sentences: string[]) {
//   const validator = getValidatorFor(language);
//
//   return runValidation(validator, {
//     sentences,
//     normalize: USE_NFC_NORMALIZATION.includes(language),
//   });
// }
//
// function runValidation(validator, { sentences = { unreviewed: [], validated: [] }, normalize }) {
//   let filtered = [];
//
//   const validate = (validSentences, sentence) => {
//     const sentenceToValidate = normalize ? sentence.normalize('NFC') : sentence;
//     const validationResult = validateSentence(validator, sentenceToValidate);
//     if (validationResult.error) {
//       filtered.push(validationResult);
//       return validSentences;
//     }
//
//     validSentences.push(sentenceToValidate);
//     return validSentences;
//   };
//
//   const valid = sentences.unreviewed.reduce(validate, []);
//   const validValidated = sentences.validated.reduce(validate, []);
//
//   return {
//     valid,
//     validValidated,
//     filtered,
//   };
// }
//
// function validateSentence(validator, sentence) {
//   const validationResult = {
//     sentence,
//   };
//
//   // We use `some` so we stop once an invalid condition is found
//   validator.INVALIDATIONS.some((invalidation) => {
//     let invalid = false;
//
//     if (invalidation.fn && typeof invalidation.fn === 'function') {
//       invalid = invalidation.fn(sentence);
//     } else if (invalidation.regex) {
//       invalid = sentence.match(invalidation.regex);
//     }
//
//     if (invalid) {
//       validationResult.error = invalidation.error;
//     }
//
//     return invalid;
//   });
//
//   return validationResult;
// }

const getValidatorFor = (locale: ValidatorLocale): ValidatorRule[] =>
  VALIDATORS[locale] || default_locale;

const valSentence =
  (rules: ValidatorRule[]) =>
  (sentence: string): E.Either<string, string> => {
    for (const rule of rules) {
      switch (rule.type) {
        case 'fn':
          if (rule.fn(sentence)) return E.left(rule.error);
          else continue;
        case 'regex':
          if (sentence.match(rule.regex)) return E.left(rule.error);
          else continue;
      }
    }
    return E.right(sentence);
  };

const normalize = (sentence: string) => sentence.normalize('NFC');

const normalizeForLocale = (locale: ValidatorLocale) => (sentence: string) =>
  USE_NFC_NORMALIZATION.includes(locale) ? normalize(sentence) : sentence;

const validateSentenceForLocale = flow(getValidatorFor, valSentence);

export const validateSentence =
  (locale: ValidatorLocale) => (sentence: string) => {
    return pipe(
      sentence,
      normalizeForLocale(locale),
      validateSentenceForLocale(locale)
    );
  };
