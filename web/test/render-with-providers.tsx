import * as React from 'react';
import { render } from '@testing-library/react';

import MockReactRouterProvider from './mock-react-router-provider';
import MockReactReduxProvider from './mock-react-redux-provider';
import MockLocalizationProvider from './mock-localization-provider';

export const renderWithProviders = (children: React.ReactNode) => {
  return render(
    <MockReactRouterProvider>
      <MockReactReduxProvider>
        <MockLocalizationProvider>{children}</MockLocalizationProvider>
      </MockReactReduxProvider>
    </MockReactRouterProvider>
  );
};
