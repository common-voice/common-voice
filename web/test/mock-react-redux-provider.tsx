import * as React from 'react';
import { Provider } from 'react-redux';

import store from '../src/stores/root';

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
