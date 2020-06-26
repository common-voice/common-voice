import * as React from 'react';
import { PageContentType } from './types';
import { withLocalization } from '@fluent/react';

const getDashboardComponents = (): PageContentType => {
  const ContentComponent = () => {
    return <h1>Hi</h1>;
  };

  const CardComponent = () => <h1>Bye</h1>;

  return {
    Content: withLocalization(ContentComponent),
    Card: withLocalization(CardComponent),
  };
};

export default getDashboardComponents;
