import * as React from 'react';

import { RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps<any> {}

export default class NotFound extends React.Component<Props, {}> {
  render() {
    return (
      <div id="not-found-container">
        <h2>Not found</h2>
        <p>I'm afraid I don't know what you're looking for.</p>
      </div>
    );
  }
}
