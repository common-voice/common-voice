import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import StateTree from '../src/stores/tree';
import { reducers } from '../src/stores/root';

const INITIAL_STATE = {
  locale: 'en',
} as StateTree;
const store = createStore(reducers, INITIAL_STATE);

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
