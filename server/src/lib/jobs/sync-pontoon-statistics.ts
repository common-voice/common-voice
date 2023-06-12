/*
 * CV relies on Pontoon for translations, language statistics and metadata. As a result, when determining the launch vs in-progress status
 * of a language, CV queries Pontoon for various statistics.
 *
 * Currently, CV only fetches Pontoon data on startup (that is, every time there is a deploy) which is not guaranteed.
 * As a result, languages can be held up being promoted and slows contributions.
 *
 * In order for a language to be launched (and start collecting clips), it must meet three distinct criteria:
 *
 */

interface PontoonLocale {
  code: string
  direction: string
  name: string
  translated: boolean
}

interface PontoonData {
  locale: PontoonLocale
  totalStrings: number
  approvedStrings: number
}

const TEST_DATA = [
  {
    totalStrings: 1239,
    approvedStrings: 807,
    locale: { code: 'mk', name: 'Macedonian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'fr', name: 'French', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1203,
    locale: { code: 'tr', name: 'Turkish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 343,
    locale: { code: 'cv', name: 'Chuvash', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'cs', name: 'Czech', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1226,
    locale: { code: 'ca', name: 'Catalan', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'sv-SE', name: 'Swedish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 806,
    locale: { code: 'pl', name: 'Polish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1195,
    locale: { code: 'zh-TW', name: 'Chinese (Taiwan)', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'he', name: 'Hebrew', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 873,
    locale: {
      code: 'nn-NO',
      name: 'Norwegian Nynorsk',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'zh-CN', name: 'Chinese (China)', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'de', name: 'German', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 977,
    locale: { code: 'tt', name: 'Tatar', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1164,
    locale: { code: 'el', name: 'Greek', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'cy', name: 'Welsh', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'nl', name: 'Dutch', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1165,
    locale: { code: 'sq', name: 'Albanian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'fy-NL', name: 'Frisian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'sk', name: 'Slovak', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 652,
    locale: { code: 'id', name: 'Indonesian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1044,
    locale: { code: 'th', name: 'Thai', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'ru', name: 'Russian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 441,
    locale: { code: 'ga-IE', name: 'Irish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1064,
    locale: { code: 'ko', name: 'Korean', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 635,
    locale: { code: 'bn', name: 'Bengali', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'it', name: 'Italian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 761,
    locale: { code: 'uz', name: 'Uzbek', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 824,
    locale: { code: 'or', name: 'Odia', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1057,
    locale: { code: 'da', name: 'Danish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'ka', name: 'Georgian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 602,
    locale: { code: 'ro', name: 'Romanian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 410,
    locale: { code: 'ta', name: 'Tamil', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1236,
    locale: { code: 'hu', name: 'Hungarian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'uk', name: 'Ukrainian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 781,
    locale: {
      code: 'nb-NO',
      name: 'Norwegian Bokm\u00e5l',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 719,
    locale: { code: 'kw', name: 'Cornish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 671,
    locale: { code: 'es', name: 'Spanish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 716,
    locale: { code: 'te', name: 'Telugu', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1063,
    locale: { code: 'ne-NP', name: 'Nepali', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 933,
    locale: { code: 'sr', name: 'Serbian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 724,
    locale: { code: 'sl', name: 'Slovenian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1065,
    locale: { code: 'kab', name: 'Kabyle', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 818,
    locale: { code: 'br', name: 'Breton', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 451,
    locale: { code: 'et', name: 'Estonian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1146,
    locale: { code: 'as', name: 'Assamese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 636,
    locale: { code: 'kk', name: 'Kazakh', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 330,
    locale: { code: 'az', name: 'Azerbaijani', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 470,
    locale: { code: 'sah', name: 'Sakha', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 456,
    locale: { code: 'kpv', name: 'Komi-Zyrian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 379,
    locale: { code: 'ky', name: 'Kyrgyz', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 824,
    locale: { code: 'fi', name: 'Finnish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1160,
    locale: { code: 'is', name: 'Icelandic', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 703,
    locale: { code: 'ja', name: 'Japanese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 802,
    locale: {
      code: 'zh-HK',
      name: 'Chinese (Hong Kong)',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1040,
    locale: { code: 'hsb', name: 'Sorbian, Upper', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 209,
    locale: { code: 'fo', name: 'Faroese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 880,
    locale: { code: 'myv', name: 'Erzya', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 571,
    locale: { code: 'cnh', name: 'Hakha Chin', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1009,
    locale: { code: 'dsb', name: 'Sorbian, Lower', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 596,
    locale: { code: 'ar', name: 'Arabic', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 749,
    locale: { code: 'an', name: 'Aragonese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'ia', name: 'Interlingua', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 667,
    locale: { code: 'ast', name: 'Asturian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 327,
    locale: { code: 'bxr', name: 'Buryat', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 634,
    locale: { code: 'cak', name: 'Kaqchikel', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 783,
    locale: { code: 'eo', name: 'Esperanto', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 749,
    locale: { code: 'ur', name: 'Urdu', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'vi', name: 'Vietnamese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 594,
    locale: { code: 'mn', name: 'Mongolian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1029,
    locale: { code: 'oc', name: 'Occitan', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 726,
    locale: { code: 'fa', name: 'Persian', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 234,
    locale: { code: 'ace', name: 'Acehnese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 569,
    locale: {
      code: 'rm-sursilv',
      name: 'Romansh Sursilvan',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 854,
    locale: { code: 'mdf', name: 'Moksha', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 822,
    locale: { code: 'sc', name: 'Sardinian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1061,
    locale: { code: 'eu', name: 'Basque', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 647,
    locale: { code: 'bg', name: 'Bulgarian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1144,
    locale: { code: 'af', name: 'Afrikaans', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 580,
    locale: { code: 'ab', name: 'Abkhaz', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 2,
    locale: { code: 'ady', name: 'Adyghe', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'am', name: 'Amharic', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'uby', name: 'Ubykh', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 884,
    locale: { code: 'mrj', name: 'Hill Mari', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1062,
    locale: { code: 'mhr', name: 'Meadow Mari', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 9,
    locale: { code: 'udm', name: 'Udmurt', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 560,
    locale: { code: 'vot', name: 'Votic', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 446,
    locale: { code: 'dv', name: 'Dhivehi', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 652,
    locale: { code: 'hr', name: 'Croatian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 434,
    locale: { code: 'rw', name: 'Kinyarwanda', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'izh', name: 'Izhorian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 594,
    locale: { code: 'lt', name: 'Lithuanian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'lv', name: 'Latvian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'gl', name: 'Galician', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 504,
    locale: { code: 'tg', name: 'Tajik', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 473,
    locale: { code: 'lij', name: 'Ligurian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 402,
    locale: { code: 'si', name: 'Sinhala', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 648,
    locale: { code: 'ha', name: 'Hausa', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 735,
    locale: { code: 'ba', name: 'Bashkir', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 751,
    locale: { code: 'ml', name: 'Malayalam', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 703,
    locale: { code: 'ff', name: 'Fulah', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 583,
    locale: {
      code: 'rm-vallader',
      name: 'Romansh Vallader',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 251,
    locale: { code: 'syr', name: 'Syriac', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 578,
    locale: { code: 'mt', name: 'Maltese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'pt', name: 'Portuguese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 832,
    locale: { code: 'sw', name: 'Swahili', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 612,
    locale: { code: 'pa-IN', name: 'Punjabi', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 912,
    locale: { code: 'be', name: 'Belarusian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'mg', name: 'Malagasy', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 17,
    locale: { code: 'arn', name: 'Mapudungun', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 759,
    locale: { code: 'kbd', name: 'Kabardian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 522,
    locale: { code: 'scn', name: 'Sicilian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 487,
    locale: { code: 'my', name: 'Burmese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 614,
    locale: { code: 'lg', name: 'Luganda', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 75,
    locale: { code: 'kaa', name: 'Karakalpak', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 686,
    locale: { code: 'tl', name: 'Tagalog', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 572,
    locale: { code: 'vec', name: 'Venetian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 614,
    locale: { code: 'hy-AM', name: 'Armenian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 577,
    locale: { code: 'hi', name: 'Hindi', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 11,
    locale: { code: 'hyw', name: 'Armenian Western', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 960,
    locale: { code: 'kmr', name: 'Kurmanji Kurdish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 756,
    locale: { code: 'co', name: 'Corsican', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 931,
    locale: { code: 'ckb', name: 'Central Kurdish', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1205,
    locale: { code: 'gn', name: 'Guarani', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 633,
    locale: { code: 'bas', name: 'Basaa', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 848,
    locale: { code: 'yue', name: 'Cantonese', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 807,
    locale: { code: 'ms', name: 'Malay', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1127,
    locale: { code: 'ps', name: 'Pashto', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 876,
    locale: { code: 'ht', name: 'Haitian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'mos', name: 'Mossi', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 710,
    locale: { code: 'mr', name: 'Marathi', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 913,
    locale: { code: 'ug', name: 'Uyghur', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'so', name: 'Somali', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 3,
    locale: { code: 'shi', name: 'Shilha', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 22,
    locale: { code: 'mai', name: 'Maithili', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 59,
    locale: {
      code: 'pap-AW',
      name: 'Papiamento (Aruba)',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 188,
    locale: { code: 'nia', name: 'Nias', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 804,
    locale: { code: 'tw', name: 'Twi', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1060,
    locale: { code: 'yo', name: 'Yoruba', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 41,
    locale: { code: 'nyn', name: 'Runyankole', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 994,
    locale: { code: 'sat', name: 'Santali (Ol Chiki)', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 152,
    locale: { code: 'ie', name: 'Interlingue', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1075,
    locale: {
      code: 'nan-tw',
      name: 'Taiwanese (Minnan)',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'ki', name: 'Kikuyu', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'yi', name: 'Yiddish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'ty', name: 'Tahitian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 849,
    locale: { code: 'ig', name: 'Igbo', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 871,
    locale: { code: 'ti', name: 'Tigrinya', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'quc', name: "K'iche'", direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 827,
    locale: { code: 'tig', name: 'Tigre', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1030,
    locale: { code: 'mni', name: 'Meetei Lon', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 917,
    locale: { code: 'tk', name: 'Turkmen', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1063,
    locale: { code: 'quy', name: 'Quechua Chanka', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'bs', name: 'Bosnian', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 58,
    locale: { code: 'km', name: 'Khmer', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 3,
    locale: { code: 'gom', name: 'Goan Konkani', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: {
      code: 'knn',
      name: 'Konkani (Devanagari)',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1075,
    locale: { code: 'tok', name: 'Toki Pona', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1220,
    locale: { code: 'skr', name: 'Saraiki', direction: 'RTL' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'lb', name: 'Luxembourgish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1085,
    locale: { code: 'dyu', name: 'Dioula', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 3,
    locale: { code: 'om', name: 'Afaan Oromo', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1060,
    locale: { code: 'ts', name: 'Xitsonga', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1052,
    locale: { code: 've', name: 'Tshivenda', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1052,
    locale: { code: 'nso', name: 'Northern Sotho', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1052,
    locale: { code: 'st', name: 'Southern Sotho', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1052,
    locale: { code: 'xh', name: 'Xhosa', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1052,
    locale: { code: 'nr', name: 'IsiNdebele (South)', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1052,
    locale: { code: 'zu', name: 'Zulu', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1052,
    locale: { code: 'tn', name: 'Setswana', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'nd', name: 'IsiNdebele (North)', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1060,
    locale: { code: 'ss', name: 'Siswati', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 16,
    locale: { code: 'hil', name: 'Hiligaynon', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 58,
    locale: { code: 'ln', name: 'Lingala', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'lo', name: 'Lao', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 16,
    locale: { code: 'snk', name: 'Soninke', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'sdh', name: 'Southern Kurdish', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 112,
    locale: { code: 'jbo', name: 'Lojban', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1239,
    locale: { code: 'zgh', name: 'Tamazight', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 260,
    locale: { code: 'kn', name: 'Kannada', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 430,
    locale: { code: 'bm', name: 'Bambara', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 1037,
    locale: { code: 'zza', name: 'Zaza', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 21,
    locale: { code: 'dag', name: 'Dagbani', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'byv', name: 'Medumba', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 22,
    locale: { code: 'tyv', name: 'Tuvan', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 13,
    locale: { code: 'wo', name: 'Wolof', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 891,
    locale: {
      code: 'nhe',
      name: 'Eastern Huasteca Nahuatl',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 886,
    locale: {
      code: 'nhi',
      name: 'Western Sierra Puebla Nahuatl',
      direction: 'LTR',
    },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'bo', name: 'Tibetan', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 0,
    locale: { code: 'ny', name: 'Chinyanja', direction: 'LTR' },
  },
  {
    totalStrings: 1239,
    approvedStrings: 454,
    locale: { code: 'ltg', name: 'Latgalian', direction: 'LTR' },
  },
] as PontoonData[]

const PONTOON_URL =
  'https://pontoon.mozilla.org/graphql?query={project(slug:%22common-voice%22){localizations{totalStrings,approvedStrings,locale{code,name,direction}}}}'

const fetchPontoonData = async (): Promise<PontoonData[]> => {
  const response = await fetch(PONTOON_URL)
  const {
    data: {
      project: { localizations },
    },
  } = await response.json()
  return localizations
}

const formatPontoonData = (localizations: PontoonData[]) => {
  return localizations
    .map(({ totalStrings, approvedStrings, locale }) => ({
      code: locale.code,
      name: locale.name,
      translated: approvedStrings / totalStrings,
      direction: locale.direction,
    }))
    .concat({ code: 'en', name: 'English', translated: 1, direction: 'LTR' }) //ensure english is included
    .sort((l1, l2) => l1.code.localeCompare(l2.code))
}

export const saveData = () => {
  console.log(formatPontoonData(TEST_DATA))
}

export const syncPontoonStatistics = () => {}

// export default fetchPontoonData
