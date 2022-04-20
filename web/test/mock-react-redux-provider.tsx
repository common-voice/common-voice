import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import StateTree from '../src/stores/tree';
import { reducers } from '../src/stores/root';

const INITIAL_STATE = {
  locale: 'en',
  languages: {
    isLoading: false,
    allLocales: ['az', 'cy', 'en', 'fr', 'nan-tw', 'pt', 'tl'],
    contributableLocales: ['az', 'cy', 'en', 'fr', 'nan-tw', 'pt', 'tl'],
    nativeNames: {
      az: 'Azərbaycanca',
      cy: 'Cymraeg',
      en: 'English',
      fr: 'Français',
      'nan-tw': '臺語',
      pt: 'Português',
      tl: 'Tagalog',
    },
    rtlLocales: ['ar', 'ckb', 'dv', 'fa', 'he', 'ps', 'skr', 'syr', 'ug', 'ur'],
    translatedLocales: ['az', 'cy', 'en', 'fr', 'nan-tw', 'pt', 'tl'],
  },
} as Partial<StateTree>;
const store = createStore(reducers, INITIAL_STATE as StateTree);

jest.mock('../src/services/api', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

const MockReactReduxProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Provider store={store}>{children}</Provider>;
};

export default MockReactReduxProvider;
