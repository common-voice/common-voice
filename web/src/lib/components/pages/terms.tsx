import * as React from 'react';
import TermsContent from '../terms-content';
import { RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps<any> {}

interface State {}

export default class Terms extends React.Component<Props, State> {
  render() {
    return (
      <div id="terms-container">
        <TermsContent />
      </div>
    );
  }
}
