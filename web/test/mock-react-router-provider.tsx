import * as React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

const MockReactRouterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Router history={history}>{children}</Router>;
};

export default MockReactRouterProvider;
