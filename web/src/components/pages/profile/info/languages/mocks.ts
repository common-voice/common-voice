import { UserLanguage } from 'common';
import { AccentsAll, VariantsAll } from './languages';

export const MOCK_USER_LANGUAGES = [
  {
    locale: 'en',
    accents: [],
  },
] as UserLanguage[];

export const MOCK_ACCENTS_ALL = {
  en: {
    userGenerated: {},
    preset: {
      '1': {
        id: 1,
        token: 'england',
        name: 'England English',
      },
      '2': {
        id: 2,
        token: 'singapore',
        name: 'Singaporean English',
      },
      '3': {
        id: 3,
        token: 'filipino',
        name: 'Filipino',
      },
    },
    default: {
      id: 18,
      token: 'unspecified',
      name: '',
    },
  },
  'zh-TW': {
    userGenerated: {},
    preset: {},
    default: {
      id: 176,
      token: 'unspecified',
      name: '',
    },
  },
} as AccentsAll;

export const MOCK_ACCENTS = [
  {
    id: 1,
    token: 'england',
    name: 'England English',
  },
  {
    id: 13,
    token: 'singapore',
    name: 'Singaporean English',
  },
];

export const MOCK_VARIANTS_ALL = {
  cy: [
    { id: 1, tag: 'cy-north', name: 'North-Western Welsh', locale: 'cy' },
    { id: 2, tag: 'cy-south', name: 'North-Eastern Welsh', locale: 'cy' },
    { id: 3, tag: 'cy-patagon', name: 'Patagonian Welsh', locale: 'cy' },
  ],
  pt: [
    { id: 1, tag: 'pt-BR', name: 'Portugese (Brasil)', locale: 'pt' },
    { id: 2, tag: 'pt-PT', name: 'Portugese (Portugal)', locale: 'pt' },
  ],
} as VariantsAll;
