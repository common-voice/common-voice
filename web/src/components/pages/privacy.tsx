import * as React from 'react';
import PrivacyContent from '../privacy-content';

import { RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps<any> {}

interface State {}

export default class Privacy extends React.Component<Props, State> {
  render() {
    return (
      <div id="privacy-container">
        <PrivacyContent />
      </div>
    );
  }
}
