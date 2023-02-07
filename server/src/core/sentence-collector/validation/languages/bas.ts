import { ValidatorRule } from "../../types/validators";

const INVALIDATIONS: ValidatorRule[] = [{
  type: 'regex',
  regex: /\s\.$/,
  error: 'Sentence should not end with a space and a period',
}, {
  type: 'regex',
  regex: /!\.$/,
  error: 'Sentence should not end with a exclamation mark and a period',
}, {
  type: 'regex',
  regex: /;$/,
  error: 'Sentence should not end with a semicolon',
}, {
  type: 'regex',
  regex: /,$/,
  error: 'Sentence should not end with a comma',
}];

export default INVALIDATIONS;
