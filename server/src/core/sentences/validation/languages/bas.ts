import { ERR_OTHER, ValidatorRule } from '../../types/validators'

const INVALIDATIONS: ValidatorRule[] = [
  {
    type: 'regex',
    regex: /\s\.$/,
    error: 'Sentence should not end with a space and a period',
    errorType: ERR_OTHER,
  },
  {
    type: 'regex',
    regex: /!\.$/,
    error: 'Sentence should not end with a exclamation mark and a period',
    errorType: ERR_OTHER,
  },
  {
    type: 'regex',
    regex: /;$/,
    error: 'Sentence should not end with a semicolon',
    errorType: ERR_OTHER,
  },
  {
    type: 'regex',
    regex: /,$/,
    error: 'Sentence should not end with a comma',
    errorType: ERR_OTHER,
  },
]

export default INVALIDATIONS
