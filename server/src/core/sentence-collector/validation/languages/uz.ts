import { ValidatorRule } from "../../types";

// Minimum of characters that qualify as a sentence.
const MIN_LENGTH = 1;

// Maximum of characters allowed per sentence to keep recordings in a manageable duration.
const MAX_LENGTH = 125;

const INVALIDATIONS: ValidatorRule[] = [{
  type: 'fn',
  fn: (sentence: string) => {
    return sentence.length < MIN_LENGTH || sentence.length > MAX_LENGTH;
  },
  error: `Number of characters must be between ${MIN_LENGTH} and ${MAX_LENGTH} (inclusive)`,
}, {
  type: 'regex',
  regex: /[0-9]+/,
  error: 'Sentence should not contain numbers',
}, {
  type: 'regex',
  regex: /[<>+*#@^[\]()/]/,
  error: 'Sentence should not contain symbols',
}, {
  // Any words consisting of uppercase letters or uppercase letters with a period
  // inbetween are considered abbreviations or acronyms.
  // This currently also matches fooBAR but we most probably don't want that either
  // as users wouldn't know how to pronounce the uppercase letters.
  type: 'regex',
  regex: /[A-Z]{2,}|[A-Z]+\.*[A-Z]+/,
  error: 'Sentence should not contain abbreviations',
}, {
  type: 'regex',
  regex: /[а-яА-Яўşқғ]/,
  error: 'Sentence should not contain non-Uzbek characters',
}, {
  // https://stackoverflow.com/questions/10992921/how-to-remove-emoji-code-using-javascript
  type: 'regex',
  regex: /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF])/,
  error: 'Sentence should not contain emojis',
}];

export default INVALIDATIONS;

