// Lao rules

import { ValidatorRule } from '../../types'

// use any rule from Thai rules https://github.com/common-voice/sentence-collector/blob/main/server/lib/validation/languages/th.js
const MIN_LENGTH = 2
const MAX_LENGTH = 140

const INVALIDATIONS: ValidatorRule[] = [
  {
    type: 'fn',
    fn: (sentence: string) => {
      return sentence.length < MIN_LENGTH || sentence.length > MAX_LENGTH
    },
    error: `ຈຳນວນຕົວອັກສອນຕ້ອງຢູ່ລະຫວ່າງ ${MIN_LENGTH} ຫາ ${MAX_LENGTH} (ລວມ)`,
  },
  {
    // Lao digits and Thai digits
    type: 'regex',
    regex: /[0-9໑໒໓໔໕໖໗໘໙໐๐-๙]/,
    error: 'ປະໂຫຍກບໍ່ຄວນມີຕົວເລກ',
  },
  {
    // English and Thai characters are not allowed
    type: 'regex',
    regex: /[A-Za-z\u0E00-\u0E7F]/,
    error: 'ປະໂຫຍກບໍ່ຄວນມີຕົວອັກສອນລາຕິນ ຫຼືຕົວອັກສອນໄທ',
  },
  {
    // < > + * \ # @ ^ [ ] ( ) /
    // ellipsis: \u0EAF ຯ
    // repetition: \u0EC6 ໆ
    type: 'regex',
    regex: /[<>+*\\#@^[\]()/\u0EAF\u0EC6]/,
    error: 'ປະໂຫຍກບໍ່ຄວນມີສັນຍາລັກ, ລວມທັງ ຯ ແລະ ໆ',
  },
  {
    // Emoji range from https://www.regextester.com/106421 and
    // https://stackoverflow.com/questions/10992921/how-to-remove-emoji-code-using-javascript
    type: 'regex',
    regex:
      /(\u00a9|\u00ae|[\u2000-\u3300]|[\u2580-\u27bf]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|[\ue000-\uf8ff])/,
    error: 'ປະໂຫຍກບໍ່ຄວນມີ ອີໂມຈິ ຫຼືສັນຍາລັກຂອງ Unicode ພິເສດອື່ນໆ',
  },
]

export default INVALIDATIONS
