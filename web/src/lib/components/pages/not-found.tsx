import * as React from 'react';

interface Props {
  active: string;
}

export default class NotFound extends React.Component<Props, {}> {
  render() {
    return (
      <div id="not-found-container" className={this.props.active}>
        <h2>Not found</h2>
        <p>I'm afraid I don't know what you're looking for.</p>
      </div>
    );
  }
}
