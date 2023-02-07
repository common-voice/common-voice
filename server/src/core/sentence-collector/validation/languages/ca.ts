import { ValidatorRule } from "../../types";

const tokenizeWords = require('talisman/tokenizers/words/gersam');

// Minimum of words that qualify as a sentence.
const MIN_WORDS = 1;

// Maximum of words allowed per sentence to keep recordings in a manageable duration.
const MAX_WORDS = 14;

const INVALIDATIONS: ValidatorRule[] = [{
  type: 'fn',
  fn: (sentence: string): boolean => {
    const words = tokenizeWords('ca', sentence);
    return words.length < MIN_WORDS || words.length > MAX_WORDS;
  },
  error: `El nombre de paraules ha de ser entre ${MIN_WORDS} i ${MAX_WORDS} (inclòs)`,
}, {
  type: 'regex',
  regex: /[0-9]+/,
  error: 'La frase no pot contenir nombres',
}, {
  // This could mean multiple sentences per line.
  type: 'regex',
  regex: /[?!.].+/,
  error: 'La frase no pot contenir signes de puntuació al mig',
}, {
  // Symbols not allowed, also add them below as well to the regex:
  // < > + * \ # @ ^ “ ” ‘ ’ ( ) [ ] / { }
  type: 'regex',
  regex: /[<>+*\\#@^“”‘’(){}[\]/]|\s{2,}|!{2,}/,
  error: 'La frase no pot contenir simbols o multiples espais o exclamacions',
}, {
  // Any words consisting of uppercase letters or uppercase letters with a period
  // inbetween are considered abbreviations or acronyms.
  // This currently also matches fooBAR but we most probably don't want that either
  // as users wouldn't know how to pronounce the uppercase letters.
  type: 'regex',
  regex: /[A-Z]{2,}|[A-Z]+\.*[A-Z]+/,
  error: 'La frase no pot contenir abreviacions o acrònims',
}];

export default INVALIDATIONS;

